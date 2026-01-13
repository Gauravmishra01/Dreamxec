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

/* ---------------------------
   PUBLIC ROUTES
---------------------------- */

// Get all approved public projects
router.get('/public', getPublicUserProjects);

// Get a single project publicly
router.get('/:id', getUserProject);

/* ---------------------------
   AUTHENTICATED USER ROUTES
---------------------------- */

router.use(protect);

// Student's own campaigns
router.get('/my', restrictTo('USER'), getMyUserProjects);

// Create campaign (only verified club users)
const multer = require('multer');

// Configure Multer
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Create campaign (only verified club users)
router.post(
  '/',
  restrictTo('USER'),
  ensureClubVerified,
  upload.fields([
    { name: 'bannerFile', maxCount: 1 },
    { name: 'deckFile', maxCount: 1 },
    { name: 'mediaFiles', maxCount: 10 }
  ]),
  validate(createUserProjectSchema),
  createUserProject
);

// Update campaign
router.put(
  '/:id',
  restrictTo('USER'),
  ensureClubVerified,
  validate(updateUserProjectSchema),
  updateUserProject
);

// Delete campaign
router.delete(
  '/:id',
  restrictTo('USER'),
  ensureClubVerified,
  deleteUserProject
);

module.exports = router;
