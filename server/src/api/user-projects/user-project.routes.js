const express = require('express');
const router = express.Router();

const {
  createUserProject,
  updateUserProject,
  deleteUserProject,
  getUserProject,
  getPublicUserProjects,
  getMyUserProjects,
} = require('./user-project.controller');

const { protect, restrictTo } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const {
  createUserProjectSchema,
  updateUserProjectSchema,
} = require('./user-project.validation');

// 🟢 Import the new middleware
const { validateCampaignEligibility, resolveCampaignClub } = require('../../middleware/club.middleware');

const multer = require('multer');

/* ---------------------------
   MULTER CONFIG
---------------------------- */
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

/* ---------------------------
   PUBLIC ROUTES
---------------------------- */
router.get('/public', getPublicUserProjects);
router.get('/:id', getUserProject);

/* ---------------------------
   AUTHENTICATED ROUTES
---------------------------- */
router.use(protect);

// Student's own campaigns
router.get('/my', restrictTo('USER', 'STUDENT_PRESIDENT'), getMyUserProjects);

// 🚀 CREATE CAMPAIGN
router.post(
  '/',
  restrictTo('USER', 'STUDENT_PRESIDENT'),           // 1. Must be a User
  upload.fields([
    { name: "bannerFile", maxCount: 1 },
    { name: "mediaFiles", maxCount: 10 },
    { name: "teamImages", maxCount: 20 }, // 🟢 NEW
  ]),
  validateCampaignEligibility,
  resolveCampaignClub,
  validate(createUserProjectSchema),
  createUserProject
);

// UPDATE CAMPAIGN
router.put(
  '/:id',
  restrictTo('USER', 'STUDENT_PRESIDENT'),
  validateCampaignEligibility, // (Optional: Keep strict check on updates too)
  validate(updateUserProjectSchema),
  updateUserProject
);

// DELETE CAMPAIGN
router.delete(
  '/:id',
  restrictTo('USER', 'STUDENT_PRESIDENT'),
  validateCampaignEligibility,
  deleteUserProject
);

module.exports = router;