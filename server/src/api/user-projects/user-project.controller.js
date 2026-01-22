const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

/* ======================================================
   CREATE USER PROJECT (WITH MILESTONES)
====================================================== */
exports.createUserProject = catchAsync(async (req, res, next) => {
  // 1. Authorization Check
  if (!req.user.studentVerified) {
    return next(new AppError('You must be a verified student to create a campaign.', 403));
  }

  // 🟢 FIX: Extract variables FIRST, before using them
  const {
    id,
    title,
    description,
    companyName,
    skillsRequired,
    goalAmount,
    timeline,
    presentationDeckUrl,
  } = req.body;

  // 🔴 REMOVED: The duplicate 'initialProject' creation block that caused the crash.

  /* -------------------------
     PARSE MILESTONES
  -------------------------- */
  let parsedMilestones = [];

  if (req.body.milestones) {
    if (typeof req.body.milestones === 'string') {
      try {
        parsedMilestones = JSON.parse(req.body.milestones);
      } catch {
        return next(new AppError('Invalid milestones format', 400));
      }
    } else {
      parsedMilestones = req.body.milestones;
    }
  }

  if (!Array.isArray(parsedMilestones) || parsedMilestones.length === 0) {
    return next(new AppError('At least one milestone is required', 400));
  }

  // Validate Budget
  const totalMilestoneBudget = parsedMilestones.reduce(
    (sum, m) => sum + Number(m.budget || 0),
    0
  );

  if (totalMilestoneBudget > Number(goalAmount)) {
    return next(
      new AppError('Total milestone budget cannot exceed goal amount', 400)
    );
  }

  /* -------------------------
     FILE UPLOADS
  -------------------------- */
  const uploads = {};

  if (req.files) {
    // Banner image (REQUIRED)
    if (req.files.bannerFile?.[0]) {
      uploads.imageUrl = await uploadToCloudinary(
        req.files.bannerFile[0].path,
        'dreamxec/campaigns/images'
      );
    }
    // Media files (OPTIONAL)
    if (req.files.mediaFiles?.length) {
      uploads.campaignMedia = await Promise.all(
        req.files.mediaFiles.map((file) => {
          let folder = 'dreamxec/campaigns/others';
          if (file.mimetype.startsWith('image/'))
            folder = 'dreamxec/campaigns/images';
          if (file.mimetype.startsWith('video/'))
            folder = 'dreamxec/campaigns/videos';

          return uploadToCloudinary(file.path, folder);
        })
      );
    }
  }

  /* -------------------------
     CREATE PROJECT + MILESTONES (Transaction)
  -------------------------- */
  const project = await prisma.$transaction(async (tx) => {
    // 1. Create Project
    const createdProject = await tx.userProject.create({
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
        goalAmount: Number(goalAmount),
        imageUrl: uploads.imageUrl,
        campaignMedia: uploads.campaignMedia || [],
        timeline: timeline || null,
        presentationDeckUrl: presentationDeckUrl?.trim() || null,
        userId: req.user.id,
        status: 'PENDING' // Ensure default status is set
      },
    });

    // 2. Create Milestones
    if (parsedMilestones.length > 0) {
      await tx.milestone.createMany({
        data: parsedMilestones.map((m) => ({
          title: m.title,
          timeline: m.timeline,
          budget: Number(m.budget),
          description: m.description || null,
          projectId: createdProject.id,
        })),
      });
    }

    return createdProject;
  });

  res.status(201).json({
    status: 'success',
    data: { userProject: project },
  });
});

// ... (Rest of the file: updateUserProject, deleteUserProject, etc. remains the same)
exports.updateUserProject = catchAsync(async (req, res, next) => {
  // ... (Keep existing update logic)
    const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
    include: { milestones: true },
  });

  if (!userProject)
    return next(new AppError('User project not found', 404));

  if (userProject.userId !== req.user.id)
    return next(new AppError('You are not authorized', 403));

  if (!['PENDING', 'REJECTED'].includes(userProject.status))
    return next(
      new AppError('Only PENDING or REJECTED projects can be updated', 400)
    );

  const updateData = { ...req.body };

  if (!('presentationDeckUrl' in req.body)) {
    delete updateData.presentationDeckUrl;
  }

  let parsedMilestones = null;
  if (req.body.milestones) {
    try {
      parsedMilestones = JSON.parse(req.body.milestones);
    } catch {
      return next(new AppError('Invalid milestones format', 400));
    }
  }

  const updatedProject = await prisma.$transaction(async (tx) => {
    const project = await tx.userProject.update({
      where: { id: req.params.id },
      data: updateData,
    });

    if (Array.isArray(parsedMilestones)) {
      await tx.milestone.deleteMany({
        where: { projectId: project.id },
      });

      await tx.milestone.createMany({
        data: parsedMilestones.map((m) => ({
          title: m.title,
          timeline: m.timeline,
          budget: Number(m.budget),
          description: m.description || null,
          projectId: project.id,
        })),
      });
    }

    return project;
  });

  res.status(200).json({
    status: 'success',
    data: { userProject: updatedProject },
  });
});

exports.deleteUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
  });

  if (!userProject)
    return next(new AppError('User project not found', 404));

  if (userProject.userId !== req.user.id)
    return next(new AppError('You are not authorized', 403));

  if (!['PENDING', 'REJECTED'].includes(userProject.status))
    return next(
      new AppError('Only PENDING or REJECTED projects can be deleted', 400)
    );

  await prisma.userProject.delete({
    where: { id: req.params.id },
  });

  res.status(204).json({ status: 'success' });
});

exports.getUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
    include: {
      milestones: true,
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

  if (!userProject)
    return next(new AppError('User project not found', 404));

  res.status(200).json({
    status: 'success',
    data: { userProject },
  });
});

exports.getPublicUserProjects = catchAsync(async (req, res) => {
  const userProjects = await prisma.userProject.findMany({
    where: { status: 'APPROVED' },
    include: {
      milestones: true,
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

exports.getMyUserProjects = catchAsync(async (req, res) => {
  const userProjects = await prisma.userProject.findMany({
    where: { userId: req.user.id },
    include: {
      milestones: true,
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