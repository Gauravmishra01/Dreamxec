const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');

// USER: Get their own profile
exports.getMe = catchAsync(async (req, res, next) => {
  // req.user is attached by the 'protect' middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    // Exclude password from the result
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      studentVerified: true,
      clubVerified: true,
      clubIds: true, 
      clubs: {
        select: {
          id: true,
          name: true,
          college: true,
          description: true,
          isVerified: true 
        }
      },
      createdAt: true,
    },
  });
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// ADMIN: Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// ADMIN: Suspend a user (Example action)
// In a real app, you might add a 'status' field to the User model.
// For this example, we'll just log the action.
exports.suspendUser = catchAsync(async (req, res, next) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }});
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    // Logic to suspend user goes here. For example, setting a `suspended` flag in the DB.
    console.log(`Admin ${req.user.id} suspended user ${req.params.id}`);
    res.status(200).json({
        status: 'success',
        message: `User ${user.name} has been suspended.`
    });
});