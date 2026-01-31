const { parse } = require('csv-parse/sync');
const Joi = require('joi');
const prisma = require('../../config/prisma'); // use your Prisma client wrapper
const { validateMembersPayload } = require('./club.validation');
const AppError = require('../../utils/AppError');

const SUMMARY = (rows) => ({
  processed: rows.length,
  created: 0,
  updated: 0,
  matchedUsers: 0,
  errors: [],
});

async function upsertClubMember({ clubId, email, name, phone, addedBy }) {
  // check existing
  const existing = await prisma.clubMember.findFirst({
    where: { clubId, email },
  });

  if (existing) {
    // update simple fields if missing
    const updates = {};
    if (name && name !== existing.name) updates.name = name;
    if (phone && phone !== existing.phone) updates.phone = phone;
    if (Object.keys(updates).length > 0) {
      await prisma.clubMember.update({
        where: { id: existing.id },
        data: updates,
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
      addedBy,
    },
  });

  return { action: 'created', record: created };
}

exports.uploadMembers = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const addedBy = req.user?.id || null;

    // Validate club existence & permission (double-check)
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) return next(new AppError('Club not found', 404));
    // optionally check that the user is the club president
    if (req.user.role !== 'ADMIN' && req.user.email !== club.presidentEmail) {
      return next(new AppError('You are not the club president', 403));
    }

    // Decide input type: CSV file in membersFile OR JSON array in body.members
    let members = [];
    if (req.file) {
      // parse CSV from buffer
      const buf = req.file.buffer;
      const text = buf.toString('utf8');
      // csv-parse sync
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
      // normalize to { email, name, phone }
      members = records.map((r) => ({
        email: (r.email || r.Email || r.E_MAIL || '').toString().trim(),
        name: (r.name || r.Name || r.fullname || '').toString().trim(),
        phone: (r.phone || r.phone_no || r.phoneNumber || '').toString().trim(),
      }));
    } else if (req.body.members) {
      // JSON: accept array of {email, name, phone}
      const raw = typeof req.body.members === 'string' ? JSON.parse(req.body.members) : req.body.members;
      members = raw.map((m) => ({
        email: (m.email || '').toString().trim(),
        name: (m.name || '').toString().trim(),
        phone: (m.phone || '').toString().trim(),
      }));
    } else if (req.body.email) {
      // single-member JSON form fields
      members = [{
        email: (req.body.email || '').toString().trim(),
        name: (req.body.name || '').toString().trim(),
        phone: (req.body.phone || '').toString().trim(),
      }];
    } else {
      return next(new AppError('No members file or payload provided', 400));
    }

    // validate payload
    const { error, value } = validateMembersPayload(members);
    if (error) return next(new AppError(`Validation failed: ${error.message}`, 400));
    members = value;

    const summary = { processed: 0, created: 0, updated: 0, matchedUsers: 0, errors: [] };

    for (const m of members) {
      summary.processed += 1;
      try {
        // upsert club member record
        const result = await upsertClubMember({ clubId, email: m.email, name: m.name, phone: m.phone, addedBy });

        if (result.action === 'created') summary.created += 1;
        else if (result.action === 'updated') summary.updated += 1;

        // if the email corresponds to an existing User, flag them as club member
        const user = await prisma.user.findUnique({ where: { email: m.email } });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isClubMember: true,
              clubVerified: true,
              clubs: {
                connect: { id: clubId }
              }
            },
          });
          // update clubMember to link user id and isUserRegistered
          await prisma.clubMember.updateMany({
            where: { clubId, email: m.email },
            data: {
              isUserRegistered: true,
              userId: user.id,
            },
          });
          summary.matchedUsers += 1;
        }
      } catch (err) {
        summary.errors.push({ member: m.email, message: err.message });
      }
    }

    return res.json({ status: 'success', data: summary });
  } catch (err) {
    next(err);
  }
};

exports.addSingleMember = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const addedBy = req.user?.id || null;
    const payload = {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
    };

    const { error, value } = validateMembersPayload([payload]);
    if (error) return next(new AppError(`Validation failed: ${error.message}`, 400));

    const result = await upsertClubMember({ clubId, email: value[0].email, name: value[0].name, phone: value[0].phone, addedBy });

    // link if user exists
    const user = await prisma.user.findUnique({ where: { email: value[0].email } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isClubMember: true,
          clubVerified: true,
          clubs: {
            connect: { id: clubId }
          }
        },
      });
      await prisma.clubMember.updateMany({
        where: { clubId, email: value[0].email },
        data: { isUserRegistered: true, userId: user.id },
      });
    }

    return res.json({ status: 'success', data: result.action });
  } catch (err) {
    next(err);
  }
};

exports.getClubMembers = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const members = await prisma.clubMember.findMany({ where: { clubId } });
    return res.json({ status: 'success', results: members.length, data: members });
  } catch (err) {
    next(err);
  }
};
