const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EVENTS=require('../../config/events');
const { promisify } = require('util');
const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const sendEmail = require('../../services/email.service');
const { publishEvent } = require('../../services/eventPublisher.service');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signVerificationToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_VERIFICATION_SECRET, {
    expiresIn: process.env.JWT_VERIFICATION_EXPIRES_IN,
  });
};

const signPasswordResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_PASSWORD_RESET_SECRET, {
    expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// 1. REGISTRATION
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, organizationName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  let newAccount;
  let accountType;
  
  // Generate verification token
  const verificationToken = signVerificationToken(email);
  const verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Check if registering as DONOR
  if (role === 'DONOR') {
    // Check if donor already exists
    const existingDonor = await prisma.donor.findUnique({ where: { email } });
    if (existingDonor) {
      return next(new AppError('Email already exists', 400));
    }

    newAccount = await prisma.donor.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organizationName: organizationName || null,
        verificationToken,
        verificationTokenExpiry,
      },
    });
    await prisma.donation.updateMany({
      where: {
        guestEmail: email,
        donorId: null
      },
      data: {
        donorId: newAccount.id
      }
    });
    await prisma.userProject.updateMany({
      where: {
        guestEmail: email,
        donorId: null
      },
      data: {
        donorId: newAccount.id
      }
    });
    const donations=await prisma.donation.findMany({
      where: {
        donorId: newAccount.id
      }
    });
    await prisma.userProject.updateMany({
      where: {
        donorId: newAccount.id
      },
      data: {
        donations: donations
      }
    });
    accountType = 'DONOR';
  } else {
    // Default to USER role
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email already exists', 400));
    }

    newAccount = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
        verificationToken,
        verificationTokenExpiry,
      },
    });
    accountType = role || 'USER';
  }

// --------------------------------------------
// AUTO-LINK GUEST DONATIONS IF EMAIL MATCHES
// --------------------------------------------
await prisma.donation.updateMany({
  where: {
    guestEmail: email,   // donations made as a guest
    donorId: null        // not yet linked to any donor
  },
  data: {
    donorId: newAccount.id
  }
});


  // Send verification email
  try {
  
    await publishEvent(EVENTS.EMAIL_VERIFICATION, {
      email: newAccount.email,
      name: newAccount.name,
      verificationUrl: `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`,
    });
    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        account: {
          id: newAccount.id,
          email: newAccount.email,
          name: newAccount.name,
          role: accountType,
        },
      },
    });
  } catch (err) {
    console.error('Email sending error:', err);
    // Registration was successful, but email failed
    res.status(201).json({
      status: 'success',
      message: 'Registration successful! You can now log in.',
      data: {
        account: {
          id: newAccount.id,
          email: newAccount.email,
          name: newAccount.name,
          role: accountType,
        },
      },
    });
  }
});

// 2. EMAIL VERIFICATION
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return next(new AppError('Verification token is missing!', 400));
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_VERIFICATION_SECRET);
    
    // Try to find as User first
    let account = await prisma.user.findUnique({ where: { email: decoded.id } });
    let accountType = 'user';
    
    // If not found as User, try as Donor
    if (!account) {
      account = await prisma.donor.findUnique({ where: { email: decoded.id } });
      accountType = 'donor';
    }

    if (!account) {
      return next(new AppError('Account not found.', 404));
    }

    // Check if token has expired
    if (account.verificationTokenExpiry && new Date() > account.verificationTokenExpiry) {
      return next(new AppError('Verification token has expired. Please request a new one.', 400));
    }

    if (account.emailVerified) {
      return res.redirect(`${process.env.CLIENT_URL}/email-verified?status=already`);
    }

    // Update the account
    if (accountType === 'user') {
      await prisma.user.update({
        where: { id: account.id },
        data: { 
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null
        },
      });
      await publishEvent(EVENTS.USER_WELCOME, {
        email: account.email,
        name: account.name,
        dashboardUrl:`${process.env.CLIENT_URL}/dashboard`
      });
    } else {
      await prisma.donor.update({
        where: { id: account.id },
        data: { 
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null
        },
      });
      await publishEvent(EVENTS.USER_WELCOME, {
        email: account.email,
        name: account.name,
        dashboardUrl:`${process.env.CLIENT_URL}/dashboard`
      });
    }

    res.redirect(`${process.env.CLIENT_URL}/email-verified?status=success`);
  } catch (err) {
    return next(new AppError('Invalid or expired verification token', 400));
  }
});


// 3. LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Try to find as User first
  let account = await prisma.user.findUnique({ where: { email } });
  let accountType = 'user';

  // If not found as User, try as Donor
  if (!account) {
    account = await prisma.donor.findUnique({ where: { email } });
    accountType = 'donor';
  }

  if (!account || !account.password || !(await bcrypt.compare(password, account.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Add role to account for consistency
  if (accountType === 'donor') {
    account.role = 'DONOR';
  }

  createAndSendToken(account, 200, res);
});


// 4. GOOGLE OAUTH CALLBACK
exports.googleCallback = catchAsync(async (req, res, next) => {
  try {
    // Passport middleware attaches user to req.user
    if (!req.user) {
      console.error('Google callback: no user on req');
      return next(new AppError('Authentication failed: no user returned from Google', 401));
    }

    console.log('Google callback user:', { id: req.user.id, email: req.user.email, googleId: req.user.googleId });

    const token = signToken(req.user.id);
    console.log('Google callback generated token for user', req.user.id);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error('Error in googleCallback:', err);
    return next(new AppError('Authentication failed', 500));
  }
});

// 4b. LINKEDIN OAUTH CALLBACK
// exports.linkedinCallback = catchAsync(async (req, res, next) => {
//   try {
//     // Passport middleware attaches user to req.user
//     if (!req.user) {
//       console.error('LinkedIn callback: no user on req');
//       return next(new AppError('Authentication failed: no user returned from LinkedIn', 401));
//     }

//     console.log('LinkedIn callback user:', { id: req.user.id, email: req.user.email, linkedinId: req.user.linkedinId });

//     const token = signToken(req.user.id);
//     console.log('LinkedIn callback generated token for user', req.user.id);

//     // Redirect to frontend with token
//     res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
//   } catch (err) {
//     console.error('Error in linkedinCallback:', err);
//     return next(new AppError('Authentication failed', 500));
//   }
// });


exports.linkedinCallback = catchAsync(async (req, res, next) => {
  try {
    // Passport middleware attaches user to req.user
    if (!req.user) {
      console.error('LinkedIn callback: no user on req');
      return next(new AppError('Authentication failed: no user returned from LinkedIn', 401));
    }

    console.log('LinkedIn callback user:', { 
      id: req.user.id, 
      email: req.user.email, 
      linkedinId: req.user.linkedinId 
    });

    // FIXED: Extract role from state parameter (OAuth-safe)
    let role = 'USER'; // default role
    
    if (req.query.state) {
      try {
        const state = JSON.parse(decodeURIComponent(req.query.state));
        role = state.role || 'USER';
        console.log('LinkedIn callback: extracted role from state:', role);
      } catch (err) {
        console.warn('LinkedIn callback: failed to parse state, using default role:', err.message);
      }
    }

    // Ensure base user role is always USER
    if (req.user.role !== 'USER') {
      req.user.role = 'USER';
    }

    // Create the appropriate profile based on selected role
    if (role === 'DONOR') {
      // Create donor profile attached to this user
      await createDonorProfile(req.user.id);
      console.log('LinkedIn callback: created DONOR profile for user', req.user.id);
    } else {
      // Create student profile (default)
      await createStudentProfile(req.user.id);
      console.log('LinkedIn callback: created STUDENT profile for user', req.user.id);
    }

    const token = signToken(req.user.id);
    console.log('LinkedIn callback generated token for user', req.user.id);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error('Error in linkedinCallback:', err);
    return next(new AppError('Authentication failed', 500));
  }
});

// 5. FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  // Try to find as User first
  let account = await prisma.user.findUnique({ where: { email } });
  let accountType = 'user';
  
  // If not found as User, try as Donor
  if (!account) {
    account = await prisma.donor.findUnique({ where: { email } });
    accountType = 'donor';
  }

  if (!account) {
    return next(new AppError('There is no account with that email address.', 404));
  }
  
  // For Google-only users
  if (!account.password) {
      return next(new AppError('This account was created with Google. Please log in with Google.', 400));
  }

  // Generate reset token and expiry
  const resetToken = signPasswordResetToken(email);
  const resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save reset token to database
  if (accountType === 'user') {
    await prisma.user.update({
      where: { id: account.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry,
      },
    });
  } else {
    await prisma.donor.update({
      where: { id: account.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry,
      },
    });
  }

  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await publishEvent(EVENTS.PASSWORD_RESET_REQUEST, {
      email: account.email,
      name: account.name,
      resetUrl: resetURL,
    });
    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email!',
    });
  } catch (err) {
    // Remove reset token if email fails
    if (accountType === 'user') {
      await prisma.user.update({
        where: { id: account.id },
        data: { resetPasswordToken: null, resetPasswordExpiry: null },
      });
    } else {
      await prisma.donor.update({
        where: { id: account.id },
        data: { resetPasswordToken: null, resetPasswordExpiry: null },
      });
    }
    
    console.error(err);
    return next(
      new AppError('There was an error sending the email. Please try again later.', 500)
    );
  }
});

// 6. RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.query;
    const { password } = req.body;
    
    if (!token) {
        return next(new AppError('Reset token is missing!', 400));
    }
    
    if (!password) {
        return next(new AppError('Please provide a new password!', 400));
    }

    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_PASSWORD_RESET_SECRET);
    } catch (err) {
      return next(new AppError('Invalid or expired reset token!', 400));
    }

    // Try to find as User first
    let account = await prisma.user.findUnique({ 
      where: { email: decoded.email } 
    });
    let accountType = 'user';
    
    // If not found as User, try as Donor
    if (!account) {
      account = await prisma.donor.findUnique({ 
        where: { email: decoded.email } 
      });
      accountType = 'donor';
    }

    if (!account) {
        return next(new AppError('Account not found.', 404));
    }
    
    // Verify the token matches and hasn't expired
    if (account.resetPasswordToken !== token) {
        return next(new AppError('Invalid reset token!', 400));
    }
    
    if (!account.resetPasswordExpiry || account.resetPasswordExpiry < new Date()) {
        return next(new AppError('Reset token has expired. Please request a new one.', 400));
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token fields
    if (accountType === 'user') {
      await prisma.user.update({
          where: { id: account.id },
          data: { 
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiry: null
          }
      });
    } else {
      await prisma.donor.update({
          where: { id: account.id },
          data: { 
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiry: null
          }
      });
    }

    // Fetch updated account and send login token
    if (accountType === 'user') {
      account = await prisma.user.findUnique({ where: { id: account.id } });
    } else {
      account = await prisma.donor.findUnique({ where: { id: account.id } });
    }

    createAndSendToken(account, 200, res);
});

// 7. Get current authenticated user
exports.getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in.', 401));
  }

  const user = { ...req.user };
  user.password = undefined;

  res.status(200).json({ status: 'success', data: { user } });
});