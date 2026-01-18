const multer = require('multer');

// Store files in memory — we only need buffer for CSV parsing
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

module.exports = upload;
