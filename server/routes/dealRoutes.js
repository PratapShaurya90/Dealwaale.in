const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/protect");
const { recordDeal, getSellerAnalytics, getBuyerAnalytics } = require("../controllers/dealsController");

router.post("/", protect, recordDeal);
router.get("/analytics", protect, getSellerAnalytics);
router.get("/buyer-analytics", protect, getBuyerAnalytics);

module.exports = router;
