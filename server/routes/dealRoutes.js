const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router();
const { createDeal, getSellerDeals } = require('../controllers/shared/dealController');
const { protect } = require('../middlewares/protect');

router.post('/', protect, createDeal);
router.get('/seller', protect, getSellerDeals);

module.exports = router;
