const express = require('express');
const applicationController = require('./application.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const {
  applyToDonorProjectSchema,
  updateApplicationStatusSchema,
} = require('./application.validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// STUDENT routes (USER role)
router.post(
  '/',
  restrictTo('USER' , 'STUDENT_PRESIDENT'),
  validate(applyToDonorProjectSchema),
  applicationController.applyToDonorProject
);

router.get(
  '/my',
  restrictTo('USER' , 'STUDENT_PRESIDENT'),
  applicationController.getMyApplications
);

router.delete(
  '/:applicationId',
  restrictTo('USER' , 'STUDENT_PRESIDENT'),
  applicationController.withdrawApplication
);

// DONOR routes
router.get(
  '/donor/all',
  restrictTo('DONOR'),
  applicationController.getApplicationsForMyProjects
);

router.get(
  '/donor/project/:projectId',
  restrictTo('DONOR'),
  applicationController.getApplicationsForProject
);

router.patch(
  '/:applicationId/status',
  restrictTo('DONOR'),
  validate(updateApplicationStatusSchema),
  applicationController.updateApplicationStatus
);

module.exports = router;
