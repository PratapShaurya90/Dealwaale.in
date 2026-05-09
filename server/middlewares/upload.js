const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../configs/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'dealwalale/tickets',   // folder name inside your Cloudinary account
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, quality: 'auto', fetch_format: 'auto' }],
    },
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
})

module.exports = upload
