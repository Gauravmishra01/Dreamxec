const express = require('express');
const donationController = require('./donation.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');



const router = express.Router();

// Anyone (logged in OR guest) can create a donation order
router.post('/create-order', donationController.createOrder);

// Razorpay webhook
// router.post('/webhook', donationController.razorpayWebhook);
router.post('/verify', donationController.verifyPayment);

// Logged-in donor only: show their donations
router.get('/my', protect, donationController.getMyDonations);

// Project owner or admin: view donations for a project
router.get('/project/:projectId', protect, donationController.getProjectDonations);

router.get(
  '/summary',
  restrictTo('DONOR'),
  donationController.getDonationSummary
);


module.exports = router;
