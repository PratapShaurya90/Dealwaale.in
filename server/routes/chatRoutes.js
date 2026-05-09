const express = require('express');
const { getRecent, getHistory } = require('../controllers/shared/chatControllers');
const { protect } = require('../middlewares/protect');

const router = express.Router();

router.get('/recent', protect, getRecent);
router.get('/history/:partnerId', protect, getHistory);

module.exports = router;