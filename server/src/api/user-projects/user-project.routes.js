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
const { ensureClubVerified } = require('../../middleware/club.middleware');

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

// ✅ Get all approved campaigns (milestones included by controller)
router.get('/public', getPublicUserProjects);

// ✅ Get one campaign by ID (milestones included)
router.get('/:id', getUserProject);

/* ---------------------------
   AUTHENTICATED ROUTES
---------------------------- */

router.use(protect);

// ✅ Student's own campaigns
router.get('/my', restrictTo('USER'), getMyUserProjects);

// ✅ Create campaign with milestones + uploads
router.post(
  '/',
  restrictTo('USER'),
  ensureClubVerified,
  upload.fields([
    { name: 'bannerFile', maxCount: 1 },
    { name: 'mediaFiles', maxCount: 10 },
  ]),
  validate(createUserProjectSchema), // 🔴 must validate milestones
  createUserProject
);

// ✅ Update campaign (milestones allowed only if PENDING / REJECTED)
router.put(
  '/:id',
  restrictTo('USER'),
  ensureClubVerified,
  validate(updateUserProjectSchema), // 🔴 must validate milestones
  updateUserProject
);

// ✅ Delete campaign
router.delete(
  '/:id',
  restrictTo('USER'),
  ensureClubVerified,
  deleteUserProject
);

module.exports = router;
