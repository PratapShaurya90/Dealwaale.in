const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' })
        }

        // multer-storage-cloudinary puts the secure_url on each file
        const urls = req.files.map((file) => file.path)

        return res.status(200).json({ urls })

    } catch (error) {
        console.error('Image upload error:', error)
        return res.status(500).json({ message: 'Image upload failed' })
    }
}

module.exports = { uploadImages }
