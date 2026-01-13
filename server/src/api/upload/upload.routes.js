const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../../middleware/auth.middleware');
const { uploadFiles } = require('./upload.controller');

// Configure Multer for temp storage
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (adjust as needed for video/decks)
  }
});

router.post('/', protect, upload.array('files', 10), uploadFiles);

module.exports = router;
