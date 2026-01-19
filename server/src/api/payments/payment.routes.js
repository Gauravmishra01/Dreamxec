const express = require('express');
const { createOrder, verifyWebhook } = require('./payment.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

// Order creation - Protected route
router.post('/create-order', protect, createOrder);

// Webhook for payment verification - No text parsing middleware should interfere here
// Note: Usually webhooks are handled on a separate path or middleware needs adjustment
// For simplicity in this flow, we might use a direct verification endpoint for client-side success callback
router.post('/verify-webhook', verifyWebhook);

module.exports = router;
