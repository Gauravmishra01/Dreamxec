const express = require('express');
const router = express.Router();
const wishlistController = require('./wishlist.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');

// All routes are protected and restricted to DONOR
router.use(protect);
router.use(restrictTo('DONOR'));

router.post('/toggle', wishlistController.toggleWishlist);
router.get('/', wishlistController.getMyWishlist);
router.get('/check/:campaignId', wishlistController.checkWishlistStatus);

module.exports = router;
