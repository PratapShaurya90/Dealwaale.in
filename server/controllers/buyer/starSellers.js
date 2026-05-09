const Rating = require("../../model/seller/ratings")

const starSeller = async (req, res) => {
    // Check if it's a GET or POST request
    if (req.method === 'GET') {
        try {
            // Find ratings for the logged-in buyer
            const ratings = await Rating.find({ userId: req.user.id })
            return res.status(200).json({
                message: "Ratings Found Successfully",
                ratings
            })
        } catch (error) {
            return res.status(500).json({ message: "Error While Finding Ratings" })
        }
    }

    if (req.method === 'POST') {
        try {
            const { rating } = req.body
            const newRating = await Rating.create({
                userId: req.user.id,
                rating
            })
            return res.status(200).json({
                message: "Seller Rated Successfully",
                newRating
            })
        } catch (error) {
            return res.status(500).json({ message: "Error While Rating Seller" })
        }
    }
}

module.exports = { starSeller }
