const User = require('../../model/shared/user')
const Rating = require("../../model/seller/ratings")

const starRatings = async (req, res) => {
    try {
        // 1. Get all IDs from the Rating collection (Featured Users)
        const ratings = await Rating.find({}).select('userId');
        const featuredUserIds = ratings.map(r => r.userId);

        // 2. Find Users who are Sellers AND are in the featured list
        const sellers = await User.find({
            _id: { $in: featuredUserIds },
            role: "seller"
        }).select("-password");

        if (sellers.length === 0) {
            return res.status(404).json({ message: "No Star Sellers Found" });
        }

        res.status(200).json({
            message: "Star Sellers Found Successfully",
            sellers
        });

    } catch (error) {
        res.status(500).json({ message: "Error While Finding Star Sellers" });
    }
}

module.exports = { starRatings }
