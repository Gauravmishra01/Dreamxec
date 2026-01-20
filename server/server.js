const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const AppError = require('./src/utils/AppError');
const globalErrorHandler = require('./src/middleware/error.middleware');

// Load environment variables
dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;
console.log("CLIENT_URL =", CLIENT_URL);

// --------------------------------------------
// Import Routes
// --------------------------------------------
const authRoutes = require('./src/api/auth/auth.routes');
const userProjectRoutes = require('./src/api/user-projects/user-project.routes');
const donorProjectRoutes = require('./src/api/donor-projects/donor-project.routes');
const userRoutes = require('./src/api/users/user.routes');
const donationRoutes = require('./src/api/donations/donation.routes');
const adminRoutes = require('./src/api/admin/admin.routes');
const webhookRoutes = require('./src/api/webhook/webhook.routes');
const applicationRoutes = require('./src/api/applications/application.routes');
const clubVerificationRoutes = require("./src/api/club-verification/clubVerification.routes");
const clubReferralRoutes = require('./src/api/club-referral/clubReferral.routes');
const adminClubReferralRoutes = require('./src/api/admin-club/adminClubReferral.routes');
const adminClubVerificationRoutes = require('./src/api/admin-club/adminClubVerification.routes');
const newsletterRoutes = require('./src/api/newsletter/newsletter.routes');
const wishlistRoutes = require('./src/api/wishlist/wishlist.routes');
const uploadRoutes = require('./src/api/upload/upload.routes');

// Load Passport (Google only, LinkedIn handled via OIDC file)
require('./src/config/passport');

const app = express();

// --------------------------------------------
// 1️⃣ CORS CONFIG — Required for OAuth cookies/sessions
// --------------------------------------------
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// --------------------------------------------
// 2️⃣ EXPRESS SESSION — Required for LinkedIn PKCE
// --------------------------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // change to true ONLY when using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// --------------------------------------------
// 3️⃣ PASSPORT INITIALIZATION
// --------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

// --------------------------------------------
// 4️⃣ STRIPE WEBHOOK MUST COME BEFORE JSON BODY PARSER
// --------------------------------------------
app.use(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  webhookRoutes
);


// --------------------------------------------
// 5️⃣ JSON BODY PARSER
// --------------------------------------------
app.use(express.json());

// --------------------------------------------
// Dev Token Generator (No change)
// --------------------------------------------
app.get("/dev/gen-token", (req, res) => {
  const generateDevToken = require("./src/utils/devToken");

  const mockUser = {
    id: "67acb1c5d40f13b3be90f7f2",
    role: "USER",
  };

  const token = generateDevToken(mockUser.id, mockUser.role);

  res.json({
    success: true,
    note: "Use this token in Authorization header",
    token,
  });
});

// --------------------------------------------
// Health Check
// --------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok, very healthy',
    env: process.env.NODE_ENV || 'development',
  });
});

// --------------------------------------------
// Root Redirect to Frontend
// --------------------------------------------
app.get('/', (req, res) => {
  if (CLIENT_URL) return res.redirect(CLIENT_URL);
  res.json({ service: 'project-x backend', status: 'running' });
});

// --------------------------------------------
// API ROUTES
// --------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/user-projects', userProjectRoutes);
app.use('/api/donor-projects', donorProjectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationRoutes);
app.use("/api/club-verification", clubVerificationRoutes);
// app.use("/api/club-referral", clubReferralRoutes);
app.use("/api/admin/referrals", adminClubReferralRoutes);
app.use("/api/admin/club-verifications", adminClubVerificationRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/upload', uploadRoutes);
app.use(cors())

// --------------------------------------------
// HANDLE 404
// --------------------------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------
app.use(globalErrorHandler);

// --------------------------------------------
// START SERVER
// --------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
