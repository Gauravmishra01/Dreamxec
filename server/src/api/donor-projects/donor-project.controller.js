const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const { publishEvent } = require('../../services/eventPublisher.service');
const EVENTS = require('../../config/events');

const {
  getDonorEligibility,
} = require('../../utils/donorEligibility');

exports.createDonorProject = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    organization,
    skillsRequired,
    timeline,
    totalBudget,
    imageUrl,
  } = req.body;

  const donorId = req.user.id;

  // 1️⃣ Get eligibility (read-only)
  const eligibility = await getDonorEligibility(donorId);

  if (!eligibility.canCreateOpportunity) {
    return next(
      new AppError(
        eligibility.allowedProjects === 0
          ? `You must donate at least ₹${eligibility.perProjectCost} to create your first opportunity.`
          : `Project limit reached (${eligibility.createdProjects}/${eligibility.allowedProjects}). Donate ₹${eligibility.perProjectCost} more to unlock another.`,
        403
      )
    );
  }

  // 2️⃣ ATOMIC CREATE (Mongo-safe)
  const result = await prisma.$runCommandRaw({
    insert: 'DonorProject',
    documents: [
      {
        title,
        description,
        organization: organization || null,
        skillsRequired: skillsRequired || [],
        timeline: timeline || null,
        totalBudget,
        imageUrl: imageUrl || null,
        donorId,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  // 3️⃣ HARD SAFETY CHECK (paranoia = good)
  const updatedEligibility = await getDonorEligibility(donorId);

  if (updatedEligibility.createdProjects > updatedEligibility.allowedProjects) {
    // rollback (extremely rare but correct)
    await prisma.donorProject.deleteMany({
      where: {
        donorId,
        status: 'PENDING',
      },
      take: 1,
    });

    return next(
      new AppError(
        'Project creation limit exceeded. Please try again.',
        409
      )
    );
  }

  res.status(201).json({
    status: 'success',
    message: `Opportunity created (${updatedEligibility.createdProjects}/${updatedEligibility.allowedProjects})`,
  });
});

/* ======================================================
   DONOR: UPDATE OWN PROJECT (SAFE)
====================================================== */
exports.updateDonorProject = catchAsync(async (req, res, next) => {
  const donorProject = await prisma.donorProject.findUnique({
    where: { id: req.params.id },
  });

  if (!donorProject) {
    return next(new AppError('Donor project not found', 404));
  }

  if (donorProject.donorId !== req.user.id) {
    return next(new AppError('You are not authorized to edit this project', 403));
  }

  if (!['PENDING', 'REJECTED'].includes(donorProject.status)) {
    return next(
      new AppError('Only PENDING or REJECTED projects can be updated.', 400)
    );
  }

  // 🔒 WHITELIST FIELDS (CRITICAL SECURITY FIX)
  const allowedFields = [
    'title',
    'description',
    'organization',
    'skillsRequired',
    'timeline',
    'totalBudget',
    'imageUrl',
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // If rejected & edited → resubmit for approval
  if (donorProject.status === 'REJECTED') {
    updateData.status = 'PENDING';
  }

  const updatedDonorProject = await prisma.donorProject.update({
    where: { id: req.params.id },
    data: updateData,
  });

  // Publish Event
  if (updatedDonorProject.status === 'APPROVED') {
    await publishEvent(EVENTS.CAMPAIGN_UPDATE, {
      email: req.user.email,
      name: req.user.name,
      campaignTitle: updatedDonorProject.title,
      campaignUrl: `${process.env.CLIENT_URL}/donor-projects/${updatedDonorProject.id}`
    });
  }

  res.status(200).json({
    status: 'success',
    data: { donorProject: updatedDonorProject },
  });
});

/* ======================================================
   DONOR: DELETE OWN PROJECT
====================================================== */
exports.deleteDonorProject = catchAsync(async (req, res, next) => {
  const donorProject = await prisma.donorProject.findUnique({
    where: { id: req.params.id },
  });

  if (!donorProject) {
    return next(new AppError('Donor project not found', 404));
  }

  if (donorProject.donorId !== req.user.id) {
    return next(
      new AppError('You are not authorized to delete this project', 403)
    );
  }

  if (!['PENDING', 'REJECTED'].includes(donorProject.status)) {
    return next(
      new AppError('Only PENDING or REJECTED projects can be deleted.', 400)
    );
  }

  await prisma.donorProject.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});

/* ======================================================
   PUBLIC: GET SINGLE PROJECT
====================================================== */
exports.getDonorProject = catchAsync(async (req, res, next) => {
  const donorProject = await prisma.donorProject.findUnique({
    where: { id: req.params.id },
    include: {
      donor: { select: { id: true, name: true, organizationName: true } },
    },
  });

  if (!donorProject) {
    return next(new AppError('Donor project not found', 404));
  }

  if (donorProject.status !== 'APPROVED') {
    if (
      !req.user ||
      (req.user.id !== donorProject.donorId && req.user.role !== 'ADMIN')
    ) {
      return next(new AppError('Donor project not found', 404));
    }
  }

  // Publish Event
  await publishEvent(EVENTS.CAMPAIGN_CREATED, {
    email: req.user.email,
    name: req.user.name,
    campaignTitle: donorProject.title,
    campaignUrl: `${process.env.CLIENT_URL}/donor-projects/${donorProject.id}`
  });

  res.status(201).json({ status: 'success', data: { donorProject } });
});

/* ======================================================
   PUBLIC: GET ALL APPROVED PROJECTS
====================================================== */
exports.getPublicDonorProjects = catchAsync(async (req, res, next) => {
  const donorProjects = await prisma.donorProject.findMany({
    where: { status: 'APPROVED' },
    include: {
      donor: { select: { id: true, name: true, organizationName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    status: 'success',
    results: donorProjects.length,
    data: { donorProjects },
  });
});

/* ======================================================
   DONOR: GET OWN PROJECTS
====================================================== */
exports.getMyDonorProjects = catchAsync(async (req, res, next) => {
  const donorProjects = await prisma.donorProject.findMany({
    where: { donorId: req.user.id },
    include: {
      donor: { select: { id: true, name: true, organizationName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    status: 'success',
    results: donorProjects.length,
    data: { donorProjects },
  });
});
