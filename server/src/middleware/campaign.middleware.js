const AppError = require('../utils/AppError');

exports.validateCampaignEligibility = (req, res, next) => {
  const user = req.user;

  // 1. Admin Bypass (Always allowed)
  if (user.role === 'ADMIN') {
    return next();
  }

  // ---------------------------------------------------------
  // FLOW CHECK 1: "Is Student Verified?" (from Diagram)
  // ---------------------------------------------------------
  if (!user.studentVerified) {
    return next(
      new AppError(
        'Campaign creation blocked: You must complete Student Verification first.',
        403
      )
    );
  }

  // ---------------------------------------------------------
  // FLOW CHECK 2: Club Association
  // ---------------------------------------------------------
  if (!user.clubId) {
    return next(
      new AppError(
        'Campaign creation blocked: You are not associated with any club. Please register a club as President or refer an existing club.',
        403
      )
    );
  }

  // ---------------------------------------------------------
  // FLOW CHECK 3: "Is Club Verified?" 
  // ---------------------------------------------------------
  // This flag should be TRUE only if the club is fully approved.
  if (!user.clubVerified) {
    return next(
      new AppError(
        'Campaign creation blocked: Your club is currently PENDING verification. Please wait for admin approval.',
        403
      )
    );
  }

  // ---------------------------------------------------------
  // FLOW CHECK 4: Role Validation
  // ---------------------------------------------------------
  // Must be President OR a valid Club Member
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