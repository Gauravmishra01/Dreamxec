const express = require('express');
const adminController = require('./admin.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');
const studentVerificationController = require('../../api/studentVerification/studentverfication.controller')

const router = express.Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

// --- DASHBOARD STATS ---
router.get('/stats', adminController.getDashboardStats); // Make sure controller has this!

// --- PROJECTS ---
router.get('/projects', adminController.getAllProjects);
router.patch('/projects/user/:id/verify', adminController.verifyUserProject);
router.patch('/projects/donor/:id/verify', adminController.verifyDonorProject);

// --- USERS & GOVERNANCE ---
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.manageUserStatus); // <--- NEW

router.get('/donors', adminController.getAllDonors);

// --- CLUBS ---
router.get('/clubs', adminController.getAllClubs); // <--- NEW
router.patch('/clubs/:id/status', adminController.manageClubStatus); // <--- NEW
router.get('/clubs/members/:clubId', adminController.getClubMembers);
router.post('/clubs/members/upload', upload.single('file'), adminController.uploadClubMembers);

// --- VERIFICATIONS ---
router.get('/club-verifications/verifications', adminController.getPendingClubVerifications);
router.post('/club-verifications/verifications/:id/approve', adminController.verifyClub);
router.post('/club-verifications/verifications/:id/reject', adminController.verifyClub);

// --------------------
// FINANCIALS
// --------------------
router.get('/financials/donations', adminController.getAllDonations);
router.get('/financials/withdrawals', adminController.getWithdrawals);
router.patch('/financials/withdrawals/:id', adminController.manageWithdrawal);


// --------------------
// MILESTONES
// --------------------
router.get('/milestones', adminController.getAllMilestones);
router.get('/milestones/pending', adminController.getPendingMilestones);
router.patch('/milestones/:id/verify', adminController.verifyMilestone);

// --------------------
// STUDENT VERIFICATION
// --------------------
router.get('/student-verifications', studentVerificationController.getAllStudentVerifications);
router.patch('/student-verifications/:id/approve', studentVerificationController.approveStudentVerification);
router.patch('/student-verifications/:id/reject', studentVerificationController.rejectStudentVerification);


// --------------------
// AUDIT LOGS
// --------------------
router.get('/audit-logs', adminController.getAuditLogs);

// getAllDonors is already there, but add these:
router.patch('/donors/:id/verify', adminController.verifyDonor);
router.patch('/donors/:id/status', adminController.manageDonorStatus);

// --------------------
// DONOR APPLICATIONS
// --------------------
router.get('/applications', adminController.getAllApplications);
router.patch('/applications/:id/override', adminController.overrideApplicationStatus);

router.get('/projects/:type/:id/details', adminController.getProjectFullDetails);

module.exports = router;