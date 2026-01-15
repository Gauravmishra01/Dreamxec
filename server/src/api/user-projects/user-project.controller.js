const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const sendEmail = require('../../services/email.service');

// -------------------------
// CREATE USER PROJECT
// -------------------------
// USER: Create a user project (Only verified club members)
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

// =========================
// CREATE USER PROJECT
// =========================
exports.createUserProject = catchAsync(async (req, res, next) => {
  const {
    id,
    title,
    description,
    companyName,
    skillsRequired,
    timeline,
    goalAmount,
    presentationDeckUrl,
  } = req.body;

  console.log('📄 Deck URL:', presentationDeckUrl);

  const initialProject = await prisma.userProject.create({
    data: {
      id: id || undefined,
      title,
      description,
      companyName: companyName || null,
      skillsRequired: skillsRequired
        ? typeof skillsRequired === 'string'
          ? JSON.parse(skillsRequired)
          : skillsRequired
        : [],
      timeline: timeline || null,
      goalAmount: parseFloat(goalAmount),
      imageUrl: null,
      campaignMedia: [],
      presentationDeckUrl: presentationDeckUrl || null, 
      userId: req.user.id,
    },
  });

  const projectId = initialProject.id;
  const updates = {};

  console.log('📦 Campaign Created:', projectId);

  // -------------------------
  // FILE UPLOADS
  // -------------------------
  if (req.files) {
    try {
      // 1. Banner Image
      if (req.files.bannerFile && req.files.bannerFile[0]) {
        console.log('🖼 Processing Banner...');
        const file = req.files.bannerFile[0];
        const folder = `dreamxec/campaigns/${projectId}/images`;
        const url = await uploadToCloudinary(file.path, folder);
        console.log('✅ Banner Uploaded:', url);
        updates.imageUrl = url;
      }





      // 3. Campaign Media
      if (req.files.mediaFiles && req.files.mediaFiles.length > 0) {
        console.log(`🎥 Processing ${req.files.mediaFiles.length} Media Files...`);
        const mediaUrls = [];
        for (const file of req.files.mediaFiles) {
          let folder = `dreamxec/campaigns/${projectId}/others`;
          if (file.mimetype.startsWith('image/')) folder = `dreamxec/campaigns/${projectId}/images`;
          else if (file.mimetype.startsWith('video/')) folder = `dreamxec/campaigns/${projectId}/videos`;

          const url = await uploadToCloudinary(file.path, folder);
          mediaUrls.push(url);
        }
        console.log('✅ Media Uploaded:', mediaUrls);
        updates.campaignMedia = mediaUrls; // This creates a new array. Note: Prisma set/push behavior.
      }
    } catch (err) {
      console.error('❌ Upload Error during creation:', err);
    }
  }

  // Update if there are any file URLs
  let finalProject = initialProject;
  if (Object.keys(updates).length > 0) {
    console.log('🔄 Updating Project with:', updates);
    finalProject = await prisma.userProject.update({
      where: { id: projectId },
      data: updates,
    });
  } else {
    console.log('⚠️ No updates to apply.');
  }

  res.status(201).json({ status: 'success', data: { userProject: finalProject } });
});

// =========================
// UPDATE USER PROJECT
// =========================
exports.updateUserProject = catchAsync(async (req, res, next) => {
  exports.getUserProject = catchAsync(async (req, res, next) => {
    const userProject = await prisma.userProject.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        title: true,
        description: true,
        companyName: true,
        skillsRequired: true,
        timeline: true,
        goalAmount: true,
        amountRaised: true,
        imageUrl: true,
        campaignMedia: true,
        presentationDeckUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        rejectionReason: true,
        userId: true,

        user: {
          select: { id: true, name: true },
        },
        donations: {
          select: {
            amount: true,
            createdAt: true,
            donor: { select: { name: true } },
            anonymous: true,
          },
        },
      },
    });

    if (!userProject) {
      return next(new AppError('User project not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { userProject },
    });
  });


  if (!userProject) return next(new AppError('User project not found', 404));

  if (userProject.userId !== req.user.id) {
    return next(new AppError('You are not authorized to edit this project', 403));
  }

  if (userProject.status !== 'PENDING' && userProject.status !== 'REJECTED') {
    return next(
      new AppError('Only PENDING or REJECTED projects can be updated.', 400)
    );
  }

  const updatedUserProject = await prisma.userProject.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.status(200).json({
    status: 'success',
    data: { userProject: updatedUserProject },
  });
});

// =========================
// DELETE USER PROJECT
// =========================
exports.deleteUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
  });

  if (!userProject) return next(new AppError('User project not found', 404));

  if (userProject.userId !== req.user.id) {
    return next(new AppError('You are not authorized to delete this project', 403));
  }

  if (userProject.status !== 'PENDING' && userProject.status !== 'REJECTED') {
    return next(
      new AppError('Only PENDING or REJECTED projects can be deleted.', 400)
    );
  }

  await prisma.userProject.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});

// =========================
// GET PROJECT BY ID
// =========================
exports.getUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true } },
      donations: {
        select: {
          amount: true,
          createdAt: true,
          donor: { select: { name: true } },
          anonymous: true,
        },
      },
    },
  });

  if (!userProject) {
    return next(new AppError('User project not found', 404));
  }

  res.status(200).json({ status: 'success', data: { userProject } });
});

// =========================
// GET PUBLIC PROJECTS
// =========================
exports.getPublicUserProjects = catchAsync(async (req, res, next) => {
  const userProjects = await prisma.userProject.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: { select: { id: true, name: true } },
      donations: { select: { amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    status: 'success',
    results: userProjects.length,
    data: { userProjects },
  });
});

// =========================
// GET MY PROJECTS
// =========================
exports.getMyUserProjects = catchAsync(async (req, res, next) => {
  const userProjects = await prisma.userProject.findMany({
    where: { userId: req.user.id },
    include: {
      user: { select: { name: true, id: true } },
      donations: { select: { amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    status: 'success',
    results: userProjects.length,
    data: { userProjects },
  });
});
