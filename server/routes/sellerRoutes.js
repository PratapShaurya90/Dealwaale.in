const express = require("express")
const router = express.Router();
const { protect } = require('../middlewares/protect')

// Controllers
const { browseDealer } = require('../controllers/seller/browseDealer')
const { quickBuys } = require('../controllers/seller/quickBuys')
const { createTicket } = require('../controllers/seller/createTicket')
const { sellerProfile } = require('../controllers/seller/sellerProfile')
const { starRating } = require('../controllers/seller/starRating') // For POSTing a rating
const { starBuyers } = require('../controllers/seller/starBuyers') // For GETting ratings
const { getMyTickets, deleteTicket } = require('../controllers/seller/myTickets')

router.get('/browsedealer', protect, browseDealer)
router.get("/quickbuys", protect, quickBuys)
router.get('/profile', protect, sellerProfile) // For getting Profile
router.post('/ticket',protect, createTicket)
router.post('/star', protect, starRating)      // For POSTing a rating
router.get("/starbuyers", protect, starBuyers)   // For GETting ratings
router.get("/mytickets", protect, getMyTickets)
router.delete("/ticket/:id", protect, deleteTicket)

module.exports = router