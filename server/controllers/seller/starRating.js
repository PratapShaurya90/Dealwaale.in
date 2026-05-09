const Rating = require("../../model/seller/ratings")

const starRating = async (req, res) => {
    try {
        const { rating } = req.body
        const user = await Rating.create({
            userId: req.user.id,
            rating
        })
        res.status(200).json(
            {
                message: "Rating updated successfully",
                user
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message: "Error While Updating Rating"
            }
        )
    }
}

module.exports = { starRating }
