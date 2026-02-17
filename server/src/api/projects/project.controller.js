const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const sendEmail = require('../../services/email.service');
const { publishEvent } = require('../../services/eventPublisher.service');
const EVENTS = require('../../config/events');

// USER: Create a project
exports.createProject = catchAsync(async (req, res, next) => {
  const { title, detail, goalAmount} = req.body;
 
  const project = await prisma.project.create({
    data: {
      title,
      detail,
      imageUrl: req.body.imageUrl || undefined,
      goalAmount,
      ownerId: req.user.id, // Assign project directly to the logged-in user
    },
  });

  if (req.user.subscriptionStatus !== 'ACTIVE') {
  return next(new AppError(
    'Please activate DreamXec membership verification before creating a campaign.',
    403
  ));
}

  // Publish Event
  await publishEvent(EVENTS.CAMPAIGN_CREATED, {
    email: req.user.email,
    name: req.user.name,
    campaignTitle: project.title,
    campaignUrl: `${process.env.CLIENT_URL}/projects/${project.id}`
  });

  res.status(201).json({ status: 'success', data: { project } });
});

// USER: Update their own pending/rejected project
exports.updateMyProject = catchAsync(async (req, res, next) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
  });

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  if (project.ownerId !== req.user.id) {
    return next(
      new AppError('You are not authorized to edit this project', 403)
    );
  }

  if (project.status !== 'PENDING' && project.status !== 'REJECTED') {
    return next(
      new AppError('Only PENDING or REJECTED projects can be updated.', 400)
    );
  }

  const updatedProject = await prisma.project.update({
    where: { id: req.params.id },
    data: req.body,
  });

  // Publish Event
  await publishEvent(EVENTS.CAMPAIGN_UPDATE, {
    email: req.user.email,
    name: req.user.name,
    campaignTitle: updatedProject.title,
    campaignUrl: `${process.env.CLIENT_URL}/projects/${updatedProject.id}`
  });

  res.status(200).json({ status: 'success', data: { project: updatedProject } });
});

// USER: Delete their own pending/rejected project
exports.deleteMyProject = catchAsync(async (req, res, next) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
  });

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  if (project.ownerId !== req.user.id) {
    return next(
      new AppError('You are not authorized to delete this project', 403)
    );
  }

  if (project.status !== 'PENDING' && project.status !== 'REJECTED') {
    return next(
      new AppError('Only PENDING or REJECTED projects can be deleted.', 400)
    );
  }

  await prisma.project.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});

// PUBLIC / OWNER: Get a single project's details
exports.getProject = catchAsync(async (req, res, next) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { owner: { select: { id: true, name: true } } },
  });

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // If project is not approved, only its owner can see it
  if (project.status !== 'APPROVED') {
    if (!req.user || project.owner.id !== req.user.id) {
      return next(
        new AppError('You do not have permission to view this project.', 403)
      );
    }
  }

  res.status(200).json({ status: 'success', data: { project } });
});

// PUBLIC: Get all approved projects
exports.getPublicProjects = catchAsync(async (req, res, next) => {
  const projects = await prisma.project.findMany({
    where: { status: 'APPROVED' },
    include: { 
      owner: { select: { id: true, name: true } },
      donations: { select: { amount: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({ 
    status: 'success', 
    results: projects.length,
    data: { projects } 
  });
});

// USER: Get all of their own projects, regardless of status
exports.getMyProjects = catchAsync(async (req, res, next) => {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: req.user.id,
    },
    include: {
      owner: {
        select: { name: true, id: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: { projects },
  });
});

// ADMIN: Get all projects for admin review
exports.getAllProjectsForAdmin = catchAsync(async (req, res, next) => {
  const projects = await prisma.project.findMany({
    include: { 
      owner: { select: { id: true, name: true, email: true } },
      donations: { select: { amount: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({ 
    status: 'success', 
    results: projects.length,
    data: { projects } 
  });
});

// ADMIN: Verify/approve or reject a project
exports.verifyProject = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body; // Accept 'reason' from the request body
  
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { owner: { select: { email: true, name: true } } }
  });

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

   const updateData = {
    status: status,
    // Save the reason if rejecting, or clear it if approving
    rejectionReason: status === 'REJECTED' ? reason : null,
  };


  const updatedProject = await prisma.project.update({
    where: { id: req.params.id },
    data: updateData
  });

  // Send event notification to project owner
  if (project.owner) {
    const eventName = status === 'APPROVED' ? EVENTS.CAMPAIGN_APPROVED : EVENTS.CAMPAIGN_REJECTED;
    
    try {
      await publishEvent(eventName, {
        email: project.owner.email,
        name: project.owner.name,
        campaignTitle: project.title,
        status: status,
        reason: reason || null,
        campaignUrl: `${process.env.CLIENT_URL}/projects/${project.id}`
      });
    } catch (err) {
      console.error('Event publishing error:', err);
    }
  }

  res.status(200).json({ 
    status: 'success', 
    data: { project: updatedProject } 
  });
});

