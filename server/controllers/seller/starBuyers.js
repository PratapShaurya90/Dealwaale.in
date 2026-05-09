const Rating = require("../../model/seller/ratings")

const starBuyers = async (req, res) => {
    try {
        const user = await Rating.find({ userId: req.user.id })
        res.status(200).json(
            {
                message: "User found successfully",
                user
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message: "Error While Finding User"
            }
        )
    }
}

module.exports = { starBuyers }
