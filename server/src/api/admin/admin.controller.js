const prisma = require('../../config/prisma.js');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// ADMIN: Get all projects (both user and donor projects)
exports.getAllProjects = catchAsync(async (req, res, next) => {
  const userProjects = await prisma.userProject.findMany({
    include: { 
      user: { select: { id: true, name: true, email: true } },
      donations: { select: { amount: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const donorProjects = await prisma.donorProject.findMany({
    include: { 
      donor: { select: { id: true, name: true, email: true, organizationName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({ 
    status: 'success', 
    data: { 
      userProjects: {
        results: userProjects.length,
        projects: userProjects
      },
      donorProjects: {
        results: donorProjects.length,
        projects: donorProjects
      }
    } 
  });
});

// ADMIN: Approve or reject a user project
exports.verifyUserProject = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;
  
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Status must be either APPROVED or REJECTED', 400));
  }

  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { email: true, name: true } } }
  });

  if (!userProject) {
    return next(new AppError('User project not found', 404));
  }

  // Update status and save rejection reason if rejected
  const updateData = { status };
  if (status === 'REJECTED' && reason) {
    updateData.rejectionReason = reason;
  } else if (status === 'APPROVED') {
    updateData.rejectionReason = null; // Clear any previous rejection reason
  }

  const updatedUserProject = await prisma.userProject.update({
    where: { id: req.params.id },
    data: updateData
  });

  // Send email notification to project owner
  if (userProject.user && userProject.user.email) {
    let rejectionDetails = 'Please review your project details and resubmit if needed.';
    if (reason) {
      rejectionDetails = `Reason: ${reason}\n\nPlease review the feedback, update your project, and resubmit.`;
    }
    const approvalMessage = 'Congratulations! Your project is now live and accepting donations.';
    
    const message = `Dear ${userProject.user.name},\n\nYour project "${userProject.title}" has been ${status.toLowerCase()}.\n\n${status === 'APPROVED' ? approvalMessage : rejectionDetails}\n\nBest regards,\nThe Platform Team`;
    
    try {
      await sendEmail({
        email: userProject.user.email,
        subject: `Your Project "${userProject.title}" has been ${status}`,
        message
      });
    } catch (err) {
      console.error('Email sending error:', err);
    }
  }

  res.status(200).json({ 
    status: 'success', 
    data: { userProject: updatedUserProject } 
  });
});

// ADMIN: Approve or reject a donor project
exports.verifyDonorProject = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;
  
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Status must be either APPROVED or REJECTED', 400));
  }

  const donorProject = await prisma.donorProject.findUnique({
    where: { id: req.params.id },
    include: { donor: { select: { email: true, name: true } } }
  });

  if (!donorProject) {
    return next(new AppError('Donor project not found', 404));
  }

  // Update status and save rejection reason if rejected
  const updateData = { status };
  if (status === 'REJECTED' && reason) {
    updateData.rejectionReason = reason;
  } else if (status === 'APPROVED') {
    updateData.rejectionReason = null; // Clear any previous rejection reason
  }

  const updatedDonorProject = await prisma.donorProject.update({
    where: { id: req.params.id },
    data: updateData
  });

  // Send email notification to donor
  if (donorProject.donor && donorProject.donor.email) {
    let rejectionDetails = 'Please review your project details and resubmit if needed.';
    if (reason) {
      rejectionDetails = `Reason: ${reason}\n\nPlease review the feedback, update your project, and resubmit.`;
    }
    const approvalMessage = 'Congratulations! Your project is now live.';
    
    const message = `Dear ${donorProject.donor.name},\n\nYour project "${donorProject.title}" has been ${status.toLowerCase()}.\n\n${status === 'APPROVED' ? approvalMessage : rejectionDetails}\n\nBest regards,\nThe Platform Team`;
    
    try {
      await sendEmail({
        email: donorProject.donor.email,
        subject: `Your Project "${donorProject.title}" has been ${status}`,
        message
      });
    } catch (err) {
      console.error('Email sending error:', err);
    }
  }

  res.status(200).json({ 
    status: 'success', 
    data: { donorProject: updatedDonorProject } 
  });
});

// ADMIN: Get all registered users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          userProjects: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

// ADMIN: Get all registered donors
exports.getAllDonors = catchAsync(async (req, res, next) => {
  const donors = await prisma.donor.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      organizationName: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          donations: true,
          donorProjects: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: donors.length,
    data: { donors }
  });
});

// ADMIN: Get all club verification requests
exports.getPendingClubVerifications = catchAsync(async (req, res, next) => {
  const requests = await prisma.clubVerification.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: { requests }
  });
});


// ADMIN: Approve or reject club verification request
exports.verifyClub = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Status must be APPROVED or REJECTED', 400));
  }

  const request = await prisma.clubVerification.findUnique({
    where: { id: req.params.id },
    include: {
      user: true
    }
  });

  if (!request)
    return next(new AppError('Club verification request not found', 404));

  const updated = await prisma.clubVerification.update({
    where: { id: req.params.id },
    data: {
      status,
      rejectionReason: status === 'REJECTED' ? reason : null
    }
  });

  // Update user if approved
  if (status === 'APPROVED') {
    await prisma.user.update({
      where: { id: request.userId },
      data: {
        clubVerified: true,
        clubId: request.clubId
      }
    });
  }

  // send email
  try {
    await sendEmail({
      email: request.user.email,
      subject: `Your club verification was ${status}`,
      message: status === 'APPROVED'
        ? `Congratulations! You are now verified as: ${request.position}`
        : `Your verification request was rejected.\nReason: ${reason}`
    });
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

// ADMIN: Upload CSV of club members
exports.uploadClubMembers = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('CSV file is required', 400));

  const csv = require('csv-parser');
  const fs = require('fs');

  const members = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      members.push({
        name: row.name,
        email: row.email,
        phone: row.phone,
        clubId: req.body.clubId
      });
    })
    .on('end', async () => {
      await prisma.clubMembership.createMany({ data: members });
      fs.unlinkSync(req.file.path); // delete file
      res.status(201).json({
        status: 'success',
        count: members.length
      });
    });
});

// ADMIN: Get all members of a club
exports.getClubMembers = catchAsync(async (req, res, next) => {
  const members = await prisma.clubMembership.findMany({
    where: { clubId: req.params.clubId },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: members.length,
    data: { members }
  });
});




/**
 * Expected CSV columns: name,email,phone,role
 * Query/body param: clubId
 */
exports.uploadClubMembers = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('CSV file is required', 400));
  const clubId = req.body.clubId;
  if (!clubId) {
    // remove file
    fs.unlinkSync(req.file.path);
    return next(new AppError('clubId is required in form body', 400));
  }

  const rows = [];
  const errors = [];
  const stream = fs.createReadStream(req.file.path).pipe(csv());

  stream.on('data', (row) => {
    // normalize keys and trim whitespace
    const name = (row.name || row.Name || row.fullname || '').trim();
    const email = (row.email || row.Email || '').trim().toLowerCase();
    const phone = (row.phone || row.Phone || row.mobile || '').trim();
    const role = (row.role || row.Role || 'member').trim();

    if (!name || !email) {
      errors.push({ row, message: 'Missing name or email' });
      return;
    }

    rows.push({ name, email, phone, role });
  });

  await new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  // process rows (upsert users or create membership records)
  const created = [];
  for (const r of rows) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email: r.email } });

      if (existingUser) {
        // create membership linking to user
        await prisma.clubMembership.create({
          data: {
            clubId,
            userId: existingUser.id,
            name: r.name,
            email: r.email,
            phone: r.phone || null,
            role: r.role || 'member',
          },
        });

        // mark user properties
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            isClubMember: true,
            clubId,
            // do not set clubVerified from CSV — admin must verify
          },
        });
      } else {
        // create membership entry (no user) — invite later
        await prisma.clubMembership.create({
          data: {
            clubId,
            name: r.name,
            email: r.email,
            phone: r.phone || null,
            role: r.role || 'member',
          },
        });
      }

      created.push(r.email);
    } catch (err) {
      console.error('Row import error for', r.email, err);
      errors.push({ row: r, message: err.message });
    }
  }

  // remove file
  try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }

  res.status(201).json({
    status: 'success',
    imported: created.length,
    errors,
  });
});