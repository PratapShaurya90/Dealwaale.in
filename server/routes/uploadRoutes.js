const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/protect')
const upload = require('../middlewares/upload')
const { uploadImages } = require('../controllers/uploadImages')

// POST /api/upload/images  — max 2 images, auth protected
router.post('/images', protect, upload.array('images', 2), uploadImages)

module.exports = router
