const express = require('express');
const router = express.Router();
const newsletterController = require('./newsletter.controller');

router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);
router.post("/send", newsletterController.sendEmails);

module.exports = router;
