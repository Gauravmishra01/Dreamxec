const prisma = require('../../config/prisma.js');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { publishEvent } = require('../../services/eventPublisher.service');
const EVENTS = require('../../config/events');

// All the admin stats required
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    userCount,
    donorCount,
    clubCount,
    campaignStats,
    donationStats,
    pendingVerifications,
    pendingDonorProjects,
    slaBreaches,
    frozenCampaigns
  ] = await prisma.$transaction([
    // 1. total users
    prisma.user.count(),

    //2. total donors
    prisma.donor.count(),

    //3. total clubs
    prisma.club.count(),

    //4. campaign stats (group by status)
    prisma.userProject.groupBy({
      by: ['status'],
      _count: { status: true }
    }),

    //5. total donation sum
    prisma.donation.aggregate({
      _sum: { amount: true }
    }),

    //6. pending approval (verfications)
    prisma.clubVerification.count({ where: { status: 'PENDING' } }),

    //7. pending approvals (donor projects)
    prisma.donorProject.count({ where: { status: 'PENDING' } }),

    //8. attention: items pending beyond sla > 7 days
    prisma.userProject.count({
      where: {
        status: 'PENDING',
        createdAt: { lt: sevenDaysAgo }
      }
    }),

    //9. Attention: frozen cammpaigns (approved but not updated in > 30days)
    prisma.userProject.count({
      where: {
        status: 'APPROVED',
        updatedAt: { lt: thirtyDaysAgo }
      }
    })
  ]);

  const campaigns = {
    APPROVED: 0,
    PENDING: 0,
    REJECTED: 0,
    total: 0
  };

  campaignStats.forEach(stat => {
    campaigns[stat.status] = stat._count.status;
    campaigns.total += stat._count.status;
  })

  const totalPendingActions =
    campaigns.PENDING +
    pendingVerifications +
    pendingDonorProjects;

  res.status(200).json({
    status: 'success',
    data: {
      kpi: {
        totalUsers: userCount,
        totalDonors: donorCount,
        totalClubs: clubCount,
        totalDonations: donationStats._sum.amount || 0,
        campaigns,
        pendingApprovals: totalPendingActions,
        openTickets: 0
      },
      attention: {
        slaBreaches,
        frozenCampaigns,
        failedMilestones: 0
      }
    }
  })
})


// ######################################
// PROJECT MANAGEMENT
// ######################################

// ADMIN: Get all projects (both user and donor projects)
exports.getAllProjects = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const skip = (page - 1) * limit;

  // FIlter objects

  const userProjectFilter = status ? { status } : {};
  const donorProjectFilter = status ? { status } : {};

  // fetch data & counts in parallel

  const [
    userProjects,
    totalUserProjects,
    donorProjects,
    totalDonorProjects
  ] = await prisma.$transaction([
    prisma.userProject.findMany({
      where: userProjectFilter,
      include: {
        user: { select: { id: true, name: true, email: true } },
        club: { select: { name: true, college: true } },
        donations: { select: { amount: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.userProject.count({ where: userProjectFilter }),

    prisma.donorProject.findMany({
      where: donorProjectFilter,
      include: {
        donor: {
          select: { id: true, name: true, email: true, organizationName: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.donorProject.count({ where: donorProjectFilter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      userProjects: {
        data: userProjects,
        pagination: {
          total: totalUserProjects,
          page,
          limit,
          totalPages: Math.ceil(totalUserProjects / limit)
        }
      },
      donorProjects: {
        data: donorProjects,
        pagination: {
          total: totalDonorProjects,
          page,
          limit,
          totalPages: Math.ceil(totalDonorProjects / limit)
        }
      }
    }
  })
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
    const eventName = status === 'APPROVED' ? EVENTS.CAMPAIGN_APPROVED : EVENTS.CAMPAIGN_REJECTED;
    
    try {
      await publishEvent(eventName, {
        email: userProject.user.email,
        name: userProject.user.name,
        campaignTitle: userProject.title,
        status: status,
        reason: reason || null,
        campaignUrl: `${process.env.CLIENT_URL}/projects/${userProject.id}`
      });
    } catch (err) {
      console.error('Email error:', err);
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
    const eventName = status === 'APPROVED' ? EVENTS.CAMPAIGN_APPROVED : EVENTS.CAMPAIGN_REJECTED;

    try {
      await publishEvent(eventName, {
        email: donorProject.donor.email,
        name: donorProject.donor.name,
        campaignTitle: donorProject.title,
        status: status,
        reason: reason || null,
        campaignUrl: `${process.env.CLIENT_URL}/projects/${donorProject.id}`
      });
    } catch (err) {
      console.error('Email error:', err);
    }
  }

  res.status(200).json({
    status: 'success',
    data: { donorProject: updatedDonorProject }
  });
});

// ##################################################
// USER & DONOR MANAGEMENT
// ##################################################

// ADMIN: Get all registered users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      accountStatus: true,
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
      accountStatus: true,
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


// ---------------------------------------------------
// GOVERNANCE (BLOCK / SUSPEND)
// ---------------------------------------------------

// ADMIN: Change User Status (Block/Unblock)
exports.manageUserStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['ACTIVE', 'BLOCKED', 'SUSPENDED', 'UNDER_REVIEW'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { accountStatus: status }
  });

  // Log Audit
  await prisma.auditLog.create({
    data: {
      action: `USER_STATUS_CHANGE`,
      entityType: 'User',
      entityId: user.id,
      performedBy: req.user.id,
      details: { newStatus: status }
    }
  });

  res.status(200).json({ status: 'success', data: { user } });
});

// ADMIN: Get All Clubs (Active + Suspended)
exports.getAllClubs = catchAsync(async (req, res, next) => {
  const clubs = await prisma.club.findMany({
    include: {
      presidentUser: { select: { name: true, email: true } },
      _count: {
        select: { members: true, campaigns: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: clubs.length,
    data: { clubs }
  });
});

// ADMIN: Change Club Status (Suspend/Activate)
exports.manageClubStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['ACTIVE', 'BLOCKED', 'SUSPENDED', 'UNDER_REVIEW'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  const club = await prisma.club.update({
    where: { id: req.params.id },
    data: { status } // accountStatus field in Club model
  });

  await prisma.auditLog.create({
    data: {
      action: `CLUB_STATUS_CHANGE`,
      entityType: 'Club',
      entityId: club.id,
      performedBy: req.user.id,
      details: { newStatus: status }
    }
  });

  res.status(200).json({ status: 'success', data: { club } });
});

// ##################################################
// CLUB VERIFICATION & Management
// ##################################################


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
  // send email
  try {
    if (request.user && request.user.email) {
        await publishEvent(EVENTS.CLUB_VERIFICATION_STATUS, {
            email: request.user.email,
            clubName: request.clubName || 'Your Club',
            status: status,
            reason: reason || null,
            dashboardUrl: `${process.env.CLIENT_URL}/dashboard`
        });
    }
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({ status: 'success', data: { updated } });
});


// Append to server/src/api/admin/admin.controller.js

// 1. Manage User Status (Block/Unblock)
exports.manageUserStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  // Basic validation
  if (!['ACTIVE', 'BLOCKED', 'SUSPENDED'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { accountStatus: status } // Ensure your Prisma schema has this field!
  });

  res.status(200).json({ status: 'success', data: { user } });
});

// 2. Get All Clubs
exports.getAllClubs = catchAsync(async (req, res, next) => {
  const clubs = await prisma.club.findMany({
    include: {
      presidentUser: { select: { name: true, email: true } },
      _count: { select: { members: true, campaigns: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: clubs.length,
    data: { clubs }
  });
});

// 3. Manage Club Status
exports.manageClubStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  const club = await prisma.club.update({
    where: { id: req.params.id },
    data: { status } // Ensure Club model has 'status' field in Prisma
  });

  res.status(200).json({ status: 'success', data: { club } });
});

// ---------------------------------------------------
// CSV UPLOAD
// ---------------------------------------------------

/**
 * Expected CSV columns: name,email,phone,role
 * Query/body param: clubId
 */
exports.uploadClubMembers = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('CSV file is required', 400));
  const clubId = req.body.clubId;
  
  if (!clubId) {
    try { fs.unlinkSync(req.file.path); } catch (e) {}
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
          },
        });

        // mark user properties
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { isClubMember: true, clubIds: { push: clubId } },
        });
      } else {
        // create membership entry (no user)
        await prisma.clubMembership.create({
          data: {
            clubId,
            name: r.name,
            email: r.email,
            phone: r.phone || null,
          },
        });
      }

      created.push(r.email);
    } catch (err) {
      // Duplicate entry usually
      errors.push({ email: r.email, message: 'Already exists or error' });
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

// ---------------------------------------------------
// FINANCIAL MANAGEMENT
// ---------------------------------------------------

// ADMIN: Get all donations (Paginated)
exports.getAllDonations = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [donations, total] = await prisma.$transaction([
    prisma.donation.findMany({
      include: {
        user: { select: { name: true, email: true } },
        donor: { select: { name: true, organizationName: true } },
        userProject: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.donation.count()
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      donations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// ADMIN: Get pending withdrawal requests
exports.getWithdrawals = catchAsync(async (req, res, next) => {
  const status = req.query.status || 'pending'; // 'pending', 'approved', 'rejected'

  const withdrawals = await prisma.withdrawal.findMany({
    where: { status },
    include: {
      userProject: {
        select: {
          title: true,
          amountRaised: true,
          user: { select: { name: true, email: true } },
          bankAccount: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: withdrawals.length,
    data: { withdrawals }
  });
});

// ADMIN: Approve or Reject Withdrawal
exports.manageWithdrawal = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;
  
  if (!['approved', 'rejected'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: req.params.id },
    include: { userProject: true }
  });

  if (!withdrawal) return next(new AppError('Withdrawal not found', 404));

  // Update Withdrawal Status
  const updated = await prisma.withdrawal.update({
    where: { id: req.params.id },
    data: { status }
  });

  // Log Audit
  await prisma.auditLog.create({
    data: {
      action: `WITHDRAWAL_${status.toUpperCase()}`,
      entityType: 'Withdrawal',
      entityId: withdrawal.id,
      performedBy: req.user.id,
      details: { amount: withdrawal.amount, note }
    }
  });

  // Send Email Notification (Mock)
  // sendEmail(withdrawal.userProject.userId, ...)

  res.status(200).json({ status: 'success', data: { withdrawal: updated } });
});

// ---------------------------------------------------
// MILESTONE VERIFICATION
// ---------------------------------------------------

// ADMIN: Get all pending milestones (Submitted for review)
exports.getPendingMilestones = catchAsync(async (req, res, next) => {
  const milestones = await prisma.milestone.findMany({
    where: { status: 'SUBMITTED' }, // Only show milestones waiting for approval
    include: {
      project: {
        select: {
          title: true,
          user: { select: { name: true, email: true } }
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: milestones.length,
    data: { milestones }
  });
});

// ADMIN: Verify Milestone (Approve/Reject)
exports.verifyMilestone = catchAsync(async (req, res, next) => {
  const { status, feedback } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const milestone = await prisma.milestone.findUnique({
    where: { id: req.params.id },
    include: { project: true }
  });

  if (!milestone) return next(new AppError('Milestone not found', 404));

  const updateData = {
    status,
    adminFeedback: feedback || null,
    approvedAt: status === 'APPROVED' ? new Date() : null
  };

  const updatedMilestone = await prisma.milestone.update({
    where: { id: req.params.id },
    data: updateData
  });

  // Log Audit
  await prisma.auditLog.create({
    data: {
      action: `MILESTONE_${status}`,
      entityType: 'Milestone',
      entityId: milestone.id,
      performedBy: req.user.id,
      details: { project: milestone.project.title, feedback }
    }
  });

  // Notify User (Mock)
  // sendEmail(milestone.project.userId, `Milestone ${status}`, ...)

  res.status(200).json({ status: 'success', data: { milestone: updatedMilestone } });
});

// ---------------------------------------------------
// MILESTONE VERIFICATION
// ---------------------------------------------------

// ADMIN: Get all submitted milestones pending review
exports.getPendingMilestones = catchAsync(async (req, res, next) => {
  const milestones = await prisma.milestone.findMany({
    where: { status: 'SUBMITTED' }, 
    include: {
      project: {
        select: {
          title: true,
          user: { select: { name: true, email: true } }
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: milestones.length,
    data: { milestones }
  });
});

// ADMIN: Approve or Reject a Milestone
exports.verifyMilestone = catchAsync(async (req, res, next) => {
  const { status, feedback } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Invalid status. Must be APPROVED or REJECTED', 400));
  }

  const milestone = await prisma.milestone.findUnique({
    where: { id: req.params.id },
    include: { project: true }
  });

  if (!milestone) return next(new AppError('Milestone not found', 404));

  const updateData = {
    status,
    adminFeedback: feedback || null,
    approvedAt: status === 'APPROVED' ? new Date() : null
  };

  const updatedMilestone = await prisma.milestone.update({
    where: { id: req.params.id },
    data: updateData
  });

  // Log to Audit Trail
  await prisma.auditLog.create({
    data: {
      action: `MILESTONE_${status}`,
      entityType: 'Milestone',
      entityId: milestone.id,
      performedBy: req.user.id,
      details: { project: milestone.project.title, feedback }
    }
  });

  // TODO: Send email notification to user about milestone status

  res.status(200).json({ status: 'success', data: { milestone: updatedMilestone } });
});


// ---------------------------------------------------
// AUDIT LOGS & SYSTEM ACTIVITY
// ---------------------------------------------------

// ADMIN: Get System Audit Logs
exports.getAuditLogs = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const { type, search } = req.query;

  const where = {};
  
  // Filter by Entity Type (User, Project, Withdrawal, etc.)
  if (type && type !== 'ALL') {
    where.entityType = type;
  }

  // Search by Action Name or Entity ID
  if (search) {
    where.OR = [
      { action: { contains: search, mode: 'insensitive' } },
      { entityId: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      include: {
        admin: { select: { name: true, email: true } } // Who performed the action
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.auditLog.count({ where })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});


// ---------------------------------------------------
// DONOR MANAGEMENT
// ---------------------------------------------------

// ADMIN: Toggle Donor Verification (Organization Verified Badge)
exports.verifyDonor = catchAsync(async (req, res, next) => {
  const { verified } = req.body; // true or false

  const donor = await prisma.donor.update({
    where: { id: req.params.id },
    data: { verified }
  });

  // Log Audit
  await prisma.auditLog.create({
    data: {
      action: `DONOR_${verified ? 'VERIFIED' : 'UNVERIFIED'}`,
      entityType: 'Donor',
      entityId: donor.id,
      performedBy: req.user.id,
      details: { organization: donor.organizationName }
    }
  });

  res.status(200).json({ status: 'success', data: { donor } });
});

// ADMIN: Manage Donor Account Status (Block/Suspend)
exports.manageDonorStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!['ACTIVE', 'BLOCKED', 'SUSPENDED'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const donor = await prisma.donor.update({
    where: { id: req.params.id },
    data: { accountStatus: status } // Ensure 'accountStatus' exists on Donor model
  });

  await prisma.auditLog.create({
    data: {
      action: `DONOR_STATUS_CHANGE`,
      entityType: 'Donor',
      entityId: donor.id,
      performedBy: req.user.id,
      details: { newStatus: status }
    }
  });

  res.status(200).json({ status: 'success', data: { donor } });
});