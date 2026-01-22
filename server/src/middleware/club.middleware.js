const AppError = require('../utils/AppError');

// A. Allow campaign creation only for:
// - Admin
// - Verified Club President
// - Verified Club Member
const ensureClubVerified = (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError('You must be logged in', 401));

  // Admin bypass
  if (user.role === 'ADMIN') return next();

  // Club president (must be verified)
  if (user.isClubPresident && user.clubVerified) return next();

  // Club member (must be verified)
  if (user.isClubMember && user.clubVerified) return next();

  return next(
    new AppError(
      'Only verified club members or admins can perform this action',
      403
    )
  );
};

// B. Check if user has active DreamXec Membership
const ensureMembershipActive = (req, res, next) => {
  const user = req.user;

  if (!user) return next(new AppError('You must be logged in', 401));

  // Admins bypass membership
  if (user.role === 'ADMIN') return next();

  // Checking membership flag set after Razorpay verification
  if (user.membershipActive) return next();

  return next(new AppError('Activate membership to create campaigns', 403));
};

// ---------------------------------------------------------
// 🚀 C. NEW: Strict Campaign Eligibility Check (The Missing Function)
// ---------------------------------------------------------
const validateCampaignEligibility = (req, res, next) => {
  const user = req.user;

  // 1. Sanity Check
  if (!user) {
    return next(new AppError('You must be logged in to create a campaign.', 401));
  }

  // 2. Admin Bypass
  if (user.role === 'ADMIN') {
    return next();
  }

  // 3. Check Student Verification
  if (!user.studentVerified) {
    return next(
      new AppError(
        'Campaign creation blocked: You must complete Student Verification first.',
        403
      )
    );
  }

  // 4. Check Club Association
  if (!user.clubId) {
    return next(
      new AppError(
        'Campaign creation blocked: You are not associated with any club. Please register a club as President or refer an existing club.',
        403
      )
    );
  }

  // 5. Check Club Verification Status
  // (Relies on user.clubVerified being synced with the Club entity)
  if (!user.clubVerified) {
    return next(
      new AppError(
        'Campaign creation blocked: Your club is currently PENDING verification. Please wait for admin approval.',
        403
      )
    );
  }

  // 6. Strict Role Validation
  // Must be a President OR a regular Member
  if (!user.isClubPresident && !user.isClubMember) {
    return next(
      new AppError(
        'Campaign creation blocked: You do not have the required permissions (President or Member).',
        403
      )
    );
  }

  next();
};

module.exports = {
  ensureClubVerified,
  ensureMembershipActive,
  validateCampaignEligibility, // 🟢 Exporting the new function
};