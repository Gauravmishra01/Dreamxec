const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
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

  const uploads = {};

  // -------------------------
  // FILE UPLOADS (FAIL HARD)
  // -------------------------
  if (req.files) {
    // Banner Image (REQUIRED)
    if (req.files.bannerFile?.[0]) {
      const file = req.files.bannerFile[0];
      const folder = `dreamxec/campaigns/temp/images`;
      uploads.imageUrl = await uploadToCloudinary(file.path, folder);
    } else {
      return next(new AppError('Banner image is required', 400));
    }

    // Campaign Media (OPTIONAL)
    if (req.files.mediaFiles?.length) {
      const mediaUrls = [];
      for (const file of req.files.mediaFiles) {
        let folder = `dreamxec/campaigns/temp/others`;
        if (file.mimetype.startsWith('image/')) folder = `dreamxec/campaigns/temp/images`;
        else if (file.mimetype.startsWith('video/')) folder = `dreamxec/campaigns/temp/videos`;

        mediaUrls.push(await uploadToCloudinary(file.path, folder));
      }
      uploads.campaignMedia = mediaUrls;
    }
  }

  // -------------------------
  // CREATE PROJECT (ONLY IF UPLOADS SUCCEED)
  // -------------------------
  const project = await prisma.userProject.create({
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
      imageUrl: uploads.imageUrl,
      campaignMedia: uploads.campaignMedia || [],
      presentationDeckUrl: presentationDeckUrl?.trim() || null,
      userId: req.user.id,
    },
  });

  res.status(201).json({
    status: 'success',
    data: { userProject: project },
  });
});

// =========================
// UPDATE USER PROJECT
// =========================
exports.updateUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
  });

  if (!userProject) return next(new AppError('User project not found', 404));
  if (userProject.userId !== req.user.id)
    return next(new AppError('You are not authorized to edit this project', 403));

  if (!['PENDING', 'REJECTED'].includes(userProject.status))
    return next(new AppError('Only PENDING or REJECTED projects can be updated.', 400));

  // 🔧 FIX: Prevent presentationDeckUrl from being overwritten
  const updateData = { ...req.body };
  if (!('presentationDeckUrl' in req.body)) {
    delete updateData.presentationDeckUrl;
  }

  const updatedUserProject = await prisma.userProject.update({
    where: { id: req.params.id },
    data: updateData,
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
  if (userProject.userId !== req.user.id)
    return next(new AppError('You are not authorized to delete this project', 403));

  if (!['PENDING', 'REJECTED'].includes(userProject.status))
    return next(new AppError('Only PENDING or REJECTED projects can be deleted.', 400));

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

  if (!userProject) return next(new AppError('User project not found', 404));

  res.status(200).json({
    status: 'success',
    data: { userProject },
  });
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