const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');
const { publishEvent } = require('../../services/eventPublisher.service');
const EVENTS = require('../../config/events');
const generateUniqueSlug = require("../../utils/generateSlug");



/* ======================================================
   CREATE USER PROJECT (WITH MILESTONES)
====================================================== */
exports.createUserProject = catchAsync(async (req, res, next) => {



  /* =============================
     AUTH CHECK
  ============================== */
  if (!req.user.studentVerified) {
    return next(
      new AppError('You must be a verified student to create a campaign.', 403)
    );
  }

  /* =============================
     BODY FIELDS
  ============================== */
  const {
    title,
    description,
    companyName,
    skillsRequired,
    campaignType = "INDIVIDUAL",
    teamMembers,
    faqs,
    youtubeUrl,
    goalAmount,
    presentationDeckUrl,
    milestones,
    clubId,
  } = req.body;

  /* =============================
   CLUB VALIDATION
============================== */
  const validatedClubId = req.validatedClubId;



  /* =============================
     PARSE TEAM MEMBERS
  ============================== */
  let parsedTeamMembers = [];

  if (teamMembers) {
    try {
      parsedTeamMembers =
        typeof teamMembers === "string"
          ? JSON.parse(teamMembers)
          : teamMembers;
    } catch {
      return next(new AppError("Invalid teamMembers JSON", 400));
    }
  }

  // If team campaign → must have members
  if (campaignType === "TEAM" && parsedTeamMembers.length === 0) {
    return next(
      new AppError("Team campaigns must include team members", 400)
    );
  }

  /* =============================
     PARSE FAQS
  ============================== */
  let parsedFaqs = [];

  if (faqs) {
    try {
      parsedFaqs =
        typeof faqs === "string"
          ? JSON.parse(faqs)
          : faqs;
    } catch {
      return next(new AppError("Invalid FAQs format", 400));
    }
  }

  /* =============================
     YOUTUBE SANITIZATION
  ============================== */
  let cleanYoutubeUrl = null;

  if (youtubeUrl) {
    const match = youtubeUrl.match(
      /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/
    );

    if (!match) {
      return next(new AppError("Invalid YouTube URL", 400));
    }

    cleanYoutubeUrl = `https://www.youtube.com/watch?v=${match[1]}`;
  }

  /* =============================
     PARSE MILESTONES
  ============================== */
  let parsedMilestones = [];

  if (milestones) {
    try {
      parsedMilestones =
        typeof milestones === "string"
          ? JSON.parse(milestones)
          : milestones;
    } catch {
      return next(new AppError("Invalid milestones format", 400));
    }
  }

  if (!Array.isArray(parsedMilestones) || parsedMilestones.length === 0) {
    return next(new AppError("At least one milestone is required", 400));
  }

  const totalMilestoneBudget = parsedMilestones.reduce(
    (sum, m) => sum + Number(m.budget || 0),
    0
  );

  if (totalMilestoneBudget > Number(goalAmount)) {
    return next(
      new AppError("Total milestone budget cannot exceed goal amount", 400)
    );
  }

  /* =============================
    FILE UPLOADS
 ============================== */
  const uploads = {};

  /* ---------- Banner ---------- */
  if (req.files?.bannerFile?.[0]) {
    uploads.imageUrl = await uploadToCloudinary(
      req.files.bannerFile[0].path,
      "dreamxec/campaigns/images"
    );
  }

  /* ---------- Media ---------- */
  if (req.files?.mediaFiles?.length) {
    uploads.campaignMedia = await Promise.all(
      req.files.mediaFiles.map((file) => {
        const folder = file.mimetype.startsWith("image/")
          ? "dreamxec/campaigns/images"
          : "dreamxec/campaigns/others";

        return uploadToCloudinary(file.path, folder);
      })
    );
  }

  /* =============================
     TEAM MEMBER IMAGE UPLOAD
  ============================== */

  let finalTeamMembers = parsedTeamMembers;

  if (campaignType === "TEAM") {

    const teamImages = req.files?.teamImages || [];

    if (teamImages.length !== parsedTeamMembers.length) {
      return next(
        new AppError(
          "Each team member must have one image",
          400
        )
      );
    }

    const uploadedImages = await Promise.all(
      teamImages.map(file =>
        uploadToCloudinary(
          file.path,
          "dreamxec/team-members"
        )
      )
    );

    finalTeamMembers = parsedTeamMembers.map((member, i) => ({
      ...member,
      image: uploadedImages[i],
    }));
  }

  /* =============================
     TRANSACTION
  ============================== */
  const project = await prisma.$transaction(async (tx) => {

    const slug = await generateUniqueSlug(title, tx);

    const createdProject = await tx.userProject.create({
      data: {
        title,
        slug,
        description,
        companyName: companyName || null,

        campaignType,
        teamMembers: finalTeamMembers,
        faqs: parsedFaqs,
        youtubeUrl: cleanYoutubeUrl,

        skillsRequired: skillsRequired
          ? typeof skillsRequired === "string"
            ? JSON.parse(skillsRequired)
            : skillsRequired
          : [],

        goalAmount: Number(goalAmount),

        presentationDeckUrl: presentationDeckUrl?.trim() || null,

        imageUrl: uploads.imageUrl || null,
        campaignMedia: uploads.campaignMedia || [],
        clubId: req.validatedClubId,
        userId: req.user.id,
        status: "PENDING",
      },
    });

    await tx.milestone.createMany({
      data: parsedMilestones.map((m) => ({
        title: m.title,
        timeline: m.timeline,
        budget: Number(m.budget),
        description: m.description || null,
        projectId: createdProject.id,
      })),
    });

    return createdProject;
  });

  res.status(201).json({
    status: "success",
    data: { userProject: project },
  });

  // Publish Event
  await publishEvent(EVENTS.CAMPAIGN_CREATED, {
    email: req.user.email,
    name: req.user.name,
    campaignTitle: project.title,
    campaignUrl: `${process.env.CLIENT_URL}/projects/${project.id}` // Assuming URL structure
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

  if (userProject.status === 'REJECTED') {
    const currentCount = userProject.reapprovalCount || 0;
    if (currentCount >= 3) {
      return next(new AppError('Maximum reapproval attempts (3) reached. Please contact support.', 403));
    }

    // Auto-increment and reset status
    req.body.reapprovalCount = currentCount + 1;
    req.body.status = 'PENDING';
    req.body.rejectionReason = null; // Clear previous rejection reason
  }

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
  const { id: identifier } = req.params;

  let userProject;

  // If it's Mongo ObjectId (24 chars)
  if (identifier.length === 24) {
    userProject = await prisma.userProject.findUnique({
      where: { id: identifier },
      include: {
        club: { select: { id: true, name: true, college: true } },
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
  } else {
    userProject = await prisma.userProject.findUnique({
      where: { slug: identifier },
      include: {
        club: { select: { id: true, name: true, college: true } },
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
  }

  if (!userProject)
    return next(new AppError("User project not found", 404));

  res.status(200).json({
    status: "success",
    data: { userProject },
  });
});


exports.getPublicUserProjects = catchAsync(async (req, res) => {
  const userProjects = await prisma.userProject.findMany({
    where: { status: 'APPROVED' },
    include: {
      club: { select: { id: true, name: true, college: true } },
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
      club: { select: { id: true, name: true, college: true } },
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

/* ======================================================
   GET STUDENT ANALYTICS
====================================================== */
exports.getStudentAnalytics = catchAsync(async (req, res, next) => {
  const projects = await prisma.userProject.findMany({
    where: { userId: req.user.id },
    select: {
      status: true,
      currentAmount: true,
      donations: { select: { amount: true } }
    }
  });

  const analytics = {
    total: projects.length,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    totalRaised: 0
  };

  projects.forEach(p => {
    // Status counting (case-insensitive safety)
    const status = p.status ? p.status.toUpperCase() : 'PENDING';
    if (status === 'APPROVED') analytics.approvedCount++;
    else if (status === 'PENDING') analytics.pendingCount++;
    else if (status === 'REJECTED') analytics.rejectedCount++;

    // Calculate funds raised
    // Use currentAmount or calculate from donations
    const raised = p.currentAmount || p.donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
    analytics.totalRaised += raised;
  });

  res.status(200).json({
    status: 'success',
    data: { analytics }
  });
});