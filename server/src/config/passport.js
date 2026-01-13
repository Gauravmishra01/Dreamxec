// --------------------------------------------
// PASSPORT OAUTH CONFIGURATION (FINAL FIXED)
// Supports:
// - USER (student)
// - DONOR
// - CLUB_MEMBER
// - CLUB_PRESIDENT
//
// Rules:
// - Existing DB records decide role
// - First-time OAuth uses frontend-selected role
// - Google & LinkedIn both allowed
// --------------------------------------------

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma");

// --------------------------------------------
// COMMON FUNCTION TO PROCESS OAUTH USER
// --------------------------------------------
async function processOAuthUser(providerIdKey, profile, requestedRole) {
  const email = profile.emails?.[0]?.value;
  const providerId = profile.id;

  if (!email) {
    throw new Error("OAuth profile email not found");
  }

  // -------------------------------
  // Phase 1 — Detect existing records
  // -------------------------------
  const donor = await prisma.donor.findUnique({ where: { email } });

  const presidentClub = await prisma.club.findFirst({
    where: { presidentEmail: email },
  });

  const clubMember = await prisma.clubMember.findFirst({
    where: { email },
  });

  const user = await prisma.user.findUnique({ where: { email } });

  // -------------------------------
  // Phase 2 — Decide role
  // Priority:
  // DB role > Club > Frontend intent
  // -------------------------------
  let role = requestedRole || "USER";

  if (donor) role = "DONOR";
  if (clubMember) role = "CLUB_MEMBER";
  if (presidentClub) role = "CLUB_PRESIDENT";

  // -----------------------------------
  // Phase 3 — Existing Donor
  // -----------------------------------
  if (donor) {
    const data = {};
    if (!donor[providerIdKey]) {
      data[providerIdKey] = providerId;
    }

    const updatedDonor = await prisma.donor.update({
      where: { id: donor.id },
      data,
    });

    // attach role for JWT usage
    updatedDonor.role = "DONOR";
    return updatedDonor;
  }

  // -----------------------------------
  // Phase 4 — Existing User
  // -----------------------------------
  if (user) {
    const data = {};
    if (!user[providerIdKey]) {
      data[providerIdKey] = providerId;
    }

    // club member logic
    if (clubMember) {
      data.role = "CLUB_MEMBER";
      data.isClubMember = true;
      data.clubId = clubMember.clubId;
    }

    // president logic
    if (presidentClub) {
      data.role = "CLUB_PRESIDENT";
      data.isClubPresident = true;
      data.clubId = presidentClub.id;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return updatedUser;
  }

  // -----------------------------------
  // Phase 5 — First-time OAuth User
  // -----------------------------------
  return await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      [providerIdKey]: providerId,
      role, // 👈 FRONTEND ROLE IS RESPECTED HERE
      isClubMember: !!clubMember,
      isClubPresident: !!presidentClub,
      clubId: clubMember?.clubId || presidentClub?.id || null,
    },
  });
}

// --------------------------------------------
// GOOGLE OAUTH STRATEGY
// --------------------------------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // 👈 REQUIRED
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const requestedRole = req.query.state || "USER";

        const user = await processOAuthUser(
          "googleId",
          profile,
          requestedRole
        );

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

// --------------------------------------------
// EXPORTS
// --------------------------------------------
module.exports = {
  passport,
  processOAuthUser,
};

// --------------------------------------------
// DIAGNOSTIC LOGS
// --------------------------------------------
console.log(
  "Passport Google callback:",
  process.env.GOOGLE_CALLBACK_URL
);
console.log(
  "Passport Google client ID:",
  process.env.GOOGLE_CLIENT_ID ? "[REDACTED]" : "NOT SET"
);
