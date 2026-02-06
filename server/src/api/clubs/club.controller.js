const { parse } = require('csv-parse/sync');
const prisma = require('../../config/prisma');
const { validateMembersPayload } = require('./club.validation');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
/* -------------------------------------------------------
   Helper: Upsert Club Member
------------------------------------------------------- */
async function upsertClubMember({ clubId, email, name, phone, addedBy }) {
  const existing = await prisma.clubMember.findFirst({
    where: { clubId, email }
  });

  if (existing) {
    const updates = {};
    if (name && name !== existing.name) updates.name = name;
    if (phone && phone !== existing.phone) updates.phone = phone;

    if (Object.keys(updates).length > 0) {
      await prisma.clubMember.update({
        where: { id: existing.id },
        data: updates
      });
      return { action: 'updated', record: existing };
    }

    return { action: 'noop', record: existing };
  }

  const created = await prisma.clubMember.create({
    data: {
      clubId,
      email,
      name,
      phone,
      addedBy
    }
  });

  return { action: 'created', record: created };
}

/* -------------------------------------------------------
   Upload / Bulk Add Members
------------------------------------------------------- */
exports.uploadMembers = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const addedBy = req.user?.id || null;

    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) return next(new AppError('Club not found', 404));

    // Club-scoped authorization
    if (
      req.user.role !== 'ADMIN' &&
      club.presidentUserId !== req.user.id
    ) {
      return next(new AppError('You are not the club president', 403));
    }

    let members = [];

    if (req.file) {
      const text = req.file.buffer.toString('utf8');
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      members = records.map(r => ({
        email: (r.email || r.Email || '').trim(),
        name: (r.name || r.Name || '').trim(),
        phone: (r.phone || r.phone_no || '').trim()
      }));
    } else if (req.body.members) {
      const raw =
        typeof req.body.members === 'string'
          ? JSON.parse(req.body.members)
          : req.body.members;

      members = raw.map(m => ({
        email: (m.email || '').trim(),
        name: (m.name || '').trim(),
        phone: (m.phone || '').trim()
      }));
    } else {
      return next(new AppError('No members file or payload provided', 400));
    }

    const { error, value } = validateMembersPayload(members);
    if (error) {
      return next(new AppError(`Validation failed: ${error.message}`, 400));
    }

    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      matchedUsers: 0,
      errors: []
    };

    for (const m of value) {
      summary.processed += 1;

      try {
        const result = await upsertClubMember({
          clubId,
          email: m.email,
          name: m.name,
          phone: m.phone,
          addedBy
        });

        if (result.action === 'created') summary.created += 1;
        if (result.action === 'updated') summary.updated += 1;

        const user = await prisma.user.findUnique({
          where: { email: m.email }
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isClubMember: true,
              clubVerified: true,
              clubs: {
                connect: { id: clubId }
              }
            }
          });

          await prisma.clubMember.updateMany({
            where: { clubId, email: m.email },
            data: {
              userId: user.id,
              isUserRegistered: true
            }
          });

          summary.matchedUsers += 1;
        }
      } catch (err) {
        summary.errors.push({
          member: m.email,
          message: err.message
        });
      }
    }

    res.json({ status: 'success', data: summary });
  } catch (err) {
    next(err);
  }
};



/* -------------------------------------------------------
   Add Single Member
------------------------------------------------------- */
exports.addSingleMember = async (req, res, next) => {
  try {
    console.log('BODY IN CONTROLLER:', req.body);
    const { clubId } = req.params;
    const addedBy = req.user?.id || null;

    const { email, name, phone } = req.body || {};

    if (!email) {
      return next(
        new AppError('Email is required to add a member', 400)
      );
    }

    const payload = [{ email, name, phone }];


    const { error, value } = validateMembersPayload(payload);
    if (error) {
      return next(new AppError(`Validation failed: ${error.message}`, 400));
    }

    const result = await upsertClubMember({
      clubId,
      email: value[0].email,
      name: value[0].name,
      phone: value[0].phone,
      addedBy
    });

    const user = await prisma.user.findUnique({
      where: { email: value[0].email }
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isClubMember: true,
          clubVerified: true,
          clubs: {
            connect: { id: clubId }
          }
        }
      });

      await prisma.clubMember.updateMany({
        where: { clubId, email: value[0].email },
        data: {
          userId: user.id,
          isUserRegistered: true
        }
      });
    }

    res.json({ status: 'success', data: result.action });
  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------------
   Remove Club Member (Final Governance Logic)
------------------------------------------------------- */
exports.removeClubMember = async (req, res, next) => {
  try {
    const { clubId, memberId } = req.params;

    const club = await prisma.club.findUnique({
      where: { id: clubId }
    });

    if (!club) {
      return next(new AppError('Club not found', 404));
    }

    if (
      req.user.role !== 'ADMIN' &&
      club.presidentUserId !== req.user.id
    ) {
      return next(new AppError('Forbidden', 403));
    }

    const member = await prisma.clubMember.findUnique({
      where: { id: memberId }
    });

    if (!member || member.clubId.toString() !== clubId) {
      return next(new AppError('Member not found in this club', 404));
    }


    // President self-removal requires successor
    if (
      member.userId &&
      member.userId === club.presidentUserId &&
      req.user.id === club.presidentUserId
    ) {
      return next(
        new AppError(
          'Please assign another president before leaving the club',
          400
        )
      );
    }

    if (member.userId) {
      await prisma.user.update({
        where: { id: member.userId },
        data: {
          clubs: {
            disconnect: { id: clubId }
          }
        }
      });

      const remainingMemberships = await prisma.clubMember.count({
        where: {
          userId: member.userId,
          clubId: { not: clubId }
        }
      });

      if (remainingMemberships === 0) {
        await prisma.user.update({
          where: { id: member.userId },
          data: { isClubMember: false }
        });
      }
    }

    await prisma.clubMember.delete({
      where: { id: memberId }
    });

    res.json({
      status: 'success',
      message: 'Member removed successfully'
    });
  } catch (err) {
    next(err);
  }
};


/* -------------------------------------------------------
   Change Club President (Succession)
------------------------------------------------------- */
exports.changeClubPresident = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const { memberId, email, name, phone } = req.body || {};

    // 1. Validate club
    const club = await prisma.club.findUnique({
      where: { id: clubId }
    });

    if (!club) {
      return next(new AppError('Club not found', 404));
    }

    // 2. Authorization: only current president or admin
    if (
      req.user.role !== 'ADMIN' &&
      club.presidentUserId !== req.user.id
    ) {
      return next(new AppError('Forbidden', 403));
    }

    let newPresidentUserId = null;

    /* -----------------------------------
       OPTION A: Promote existing member
    ----------------------------------- */
    if (memberId) {
      const member = await prisma.clubMember.findUnique({
        where: { id: memberId }
      });

      if (!member || member.clubId.toString() !== clubId) {
        return next(new AppError('Invalid club member', 400));
      }

      if (!member.userId) {
        return next(
          new AppError('Selected member is not a registered user', 400)
        );
      }

      newPresidentUserId = member.userId;
    }

    /* -----------------------------------
       OPTION B: Add + promote new president
    ----------------------------------- */
    if (!newPresidentUserId && email) {
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            isClubMember: true
          }
        });
      }

      newPresidentUserId = user.id;

      await prisma.clubMember.upsert({
        where: {
          clubId_email: { clubId, email }
        },
        update: {
          userId: newPresidentUserId,
          isUserRegistered: true
        },
        create: {
          clubId,
          email,
          name,
          phone,
          userId: newPresidentUserId,
          isUserRegistered: true
        }
      });
    }

    if (!newPresidentUserId) {
      return next(
        new AppError(
          'Provide either memberId or new president details',
          400
        )
      );
    }

    // 3. Update club president
    await prisma.club.update({
      where: { id: clubId },
      data: {
        presidentUserId: newPresidentUserId
      }
    });

    res.json({
      status: 'success',
      message: 'President changed successfully'
    });

  } catch (err) {
    next(err);
  }
};


/* -------------------------------------------------------
   Get Club Members
------------------------------------------------------- */
exports.getClubMembers = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    const members = await prisma.clubMember.findMany({
      where: { clubId }
    });

    res.json({
      status: 'success',
      results: members.length,
      data: members
    });
  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------------
   Get Approved Campaigns Under Club
------------------------------------------------------- */
exports.getApprovedClubCampaigns = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    const club = await prisma.club.findUnique({
      where: { id: clubId }
    });

    if (!club) {
      return next(new AppError('Club not found', 404));
    }

    if (
      req.user.role !== 'ADMIN' &&
      club.presidentUserId !== req.user.id
    ) {
      return next(new AppError('Forbidden', 403));
    }

    const members = await prisma.clubMember.findMany({
      where: {
        clubId,
        userId: { not: null }
      },
      select: { userId: true }
    });

    const userIds = members.map(m => m.userId);

    if (userIds.length === 0) {
      return res.json({
        status: 'success',
        results: 0,
        data: []
      });
    }

    const campaigns = await prisma.userProject.findMany({
      where: {
        userId: { in: userIds },
        status: 'APPROVED'
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      results: campaigns.length,
      data: campaigns
    });
  } catch (err) {
    next(err);
  }
};
/* -------------------------------------------------------
   Get Pending Campaigns Under Club
   (For President/Admin Review)
------------------------------------------------------- */
exports.getPendingClubCampaigns = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    // 1. Validate club
    const club = await prisma.club.findUnique({
      where: { id: clubId }
    });

    if (!club) {
      return next(new AppError('Club not found', 404));
    }

    // 2. Authorization: admin OR club president
    if (
      req.user.role !== 'ADMIN' &&
      club.presidentUserId !== req.user.id
    ) {
      return next(
        new AppError('You are not authorized to view these campaigns', 403)
      );
    }

    // 3. Get club members with registered users
    const members = await prisma.clubMember.findMany({
      where: {
        clubId,
        userId: { not: null }
      },
      select: { userId: true }
    });

    const userIds = members.map(m => m.userId);

    if (userIds.length === 0) {
      return res.json({
        status: 'success',
        results: 0,
        data: []
      });
    }

    // 4. Fetch PENDING campaigns
    const campaigns = await prisma.userProject.findMany({
      where: {
        userId: { in: userIds },
        status: 'PENDING'
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      results: campaigns.length,
      data: campaigns
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------------
   Get Rejected Campaigns Under Club
   (For President/Admin Review)
------------------------------------------------------- */
exports.getRejectedClubCampaigns = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    // 1. Validate club
    const club = await prisma.club.findUnique({
      where: { id: clubId }
    });

    if (!club) {
      return next(new AppError('Club not found', 404));
    }

    // 2. Authorization: admin OR club president
    if (
      req.user.role !== 'ADMIN' &&
      club.presidentUserId !== req.user.id
    ) {
      return next(
        new AppError('You are not authorized to view these campaigns', 403)
      );
    }

    // 3. Get club members with registered users
    const members = await prisma.clubMember.findMany({
      where: {
        clubId,
        userId: { not: null }
      },
      select: { userId: true }
    });

    const userIds = members.map(m => m.userId);

    if (userIds.length === 0) {
      return res.json({
        status: 'success',
        results: 0,
        data: []
      });
    }

    // 4. Fetch REJECTED campaigns
    const campaigns = await prisma.userProject.findMany({
      where: {
        userId: { in: userIds },
        status: 'REJECTED'
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      results: campaigns.length,
      data: campaigns
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------------
   Get My Clubs
------------------------------------------------------- */
exports.getMyClubs = catchAsync(async (req, res) => {
  const user = req.user;

  if (!user.clubIds || user.clubIds.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: { clubs: [] },
    });
  }

  const clubs = await prisma.club.findMany({
    where: {
      id: { in: user.clubIds },
    },
    select: {
      id: true,
      name: true,
      college: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: { clubs },
  });
});

/* ------------------ */