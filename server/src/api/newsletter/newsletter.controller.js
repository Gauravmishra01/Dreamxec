const AppError = require('../../utils/AppError');
const {sendEmail}=require("../../services/email.service");
const prisma = require('../../config/prisma'); // use your Prisma client wrapper
const catchAsync = require('../../utils/catchAsync');
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const sendEmails  = catchAsync(async (req,res,next)=>{
    const {subject,message}=req.body;
    if(!subject||!message){
      return res.status(400).json({
        success:false,
        message:"Please provide subject and message"
      })
    }
    const subscribers = await prisma.subscriber.findMany({
      where: { isActive: true },
    });
    for(const subscriber of subscribers){
      sendEmail({email:subscriber.email,subject,message});
    }
    res.status(200).json({
      success:true,
      message:"Email sent successfully"
    })
})

const subscribe = catchAsync(async (req, res, next) => {
  try {
    const { email, source } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

  const existing = await prisma.subscriber.findUnique({
    where: { email },
  });

  if (existing) {
    if (!existing.isActive) {
      return await prisma.subscriber.update({
        where: { email },
        data: { isActive: true, source },
      });
    }
    throw new Error('Email already subscribed');
  }

   const subscriber = await prisma.subscriber.create({
    data: {
      email,
      source,
      isActive: true,
    },
  });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data: { subscriber },
    });
  } catch (error) {
    if (error.message === 'Email already subscribed') {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed.',
      });
    }
    next(error);
  }
});

const unsubscribe = catchAsync(async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return next(new AppError('Email is required', 400));
        
        const existing = await prisma.subscriber.findUnique({
            where: { email },
          });
          
          if (!existing) {
            return res.status(409).json({
              success: false,
              message: 'This email is not subscribed.',
            });
          }
          
          if (existing.isActive) {
             await prisma.subscriber.update({
              where: { email },
              data: { isActive: false },
            });
            return res.status(200).json({
            success: true,
            message: 'Successfully unsubscribed.'
        });

          }
          res.status(409).json({
            success: false,
            message: 'This email is already unsubscribed.',
          });
        
        
    } catch (error) {
        next(error);
    }
});


module.exports = {
  subscribe,
  unsubscribe,
  sendEmails,
};
