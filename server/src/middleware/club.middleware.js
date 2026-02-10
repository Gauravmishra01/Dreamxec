const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

// clubId is already validated in resolveCampaignClub middleware
// DO NOT re-check membership here
/* ======================================================
   A. Ensure Club Verified
====================================================== */
const ensureClubVerified = (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError('You must be logged in', 401));

  if (user.role === 'ADMIN') return next();

  if ((user.isClubPresident || user.isClubMember) && user.clubVerified) {
    return next();
  }

  return next(
    new AppError(
      'Only verified club members or admins can perform this action',
      403
    )
  );
};

/* ======================================================
   B. Resolve Campaign Club
====================================================== */
const resolveCampaignClub = async (req, res, next) => {
  const { clubId } = req.body;
  const user = req.user;

  if (!clubId) {
    return next(new AppError('clubId is required to create a campaign', 400));
  }

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: { id: true },
  });

  if (!club) {
    return next(new AppError('Club not found', 404));
  }

  // ✅ ADMIN can always proceed
  if (user.role === 'ADMIN') {
    req.validatedClubId = club.id;
    return next();
  }

  // ✅ CLUB PRESIDENT can proceed
  if (user.isClubPresident) {
    req.validatedClubId = club.id;
    return next();
  }

  // ✅ CLUB MEMBER can proceed
  if (user.isClubMember) {
    req.validatedClubId = club.id;
    return next();
  }

  return next(
    new AppError('You are not authorized to create a campaign for this club', 403)
  );
};



/* ======================================================
   C. Validate Campaign Eligibility
====================================================== */
const validateCampaignEligibility = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('You must be logged in.', 401));
  }

  if (user.role === 'ADMIN') return next();

  if (!user.studentVerified) {
    return next(
      new AppError(
        'Campaign creation blocked: Complete student verification.',
        403
      )
    );
  }

  if (!user.clubIds || user.clubIds.length === 0) {
    return next(new AppError('You are not associated with any club.', 403));
  }

  if (!user.clubVerified) {
    return next(
      new AppError(
        'Campaign creation blocked: Club not verified yet.',
        403
      )
    );
  }

  if (!user.isClubPresident && !user.isClubMember) {
    return next(
      new AppError(
        'Campaign creation blocked: Insufficient permissions.',
        403
      )
    );
  }

  next();
};

module.exports = {
  ensureClubVerified,
  resolveCampaignClub,
  validateCampaignEligibility,
};
