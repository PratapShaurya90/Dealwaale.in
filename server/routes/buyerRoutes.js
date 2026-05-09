const express = require("express")
const router = express.Router();
const { protect } = require('../middlewares/protect')

// Controllers
const { browseSellers } = require("../controllers/buyer/browseSellers");
const { profile } = require('../controllers/buyer/profile')
const { createTicket } = require('../controllers/buyer/createTicket')
const { quickSellers } = require('../controllers/buyer/quickSellers')
const { starSeller } = require('../controllers/buyer/starSellers') // For POSTing a rating
const { starRatings } = require('../controllers/buyer/starRatings'); // For GETting ratings

router.get('/browsesellers', protect, browseSellers)
router.get('/profile', protect, profile)
router.get('/quicksellers', protect, quickSellers)
router.post('/tickets', protect, createTicket)
router.post('/star', protect, starSeller) // For POSTing a rating
router.get('/starRatings', protect, starRatings)    // For GETting ratings

module.exports = router