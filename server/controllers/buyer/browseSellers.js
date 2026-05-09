const User = require('../../model/shared/user')

const browseSellers = async (req, res) => {
    try {
        const { search, category, city } = req.query;
        let query = { role: "seller" };

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { categories: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (category) {
            query.categories = { $in: [category] };
        }

        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        const sellers = await User.find(query).select("-password");

        if (sellers.length === 0) {
            return res.status(404).json({ message: "No Sellers Found matching your criteria" })
        }

        res.status(200).json({
            message: "Sellers Found Successfully",
            sellers
        })

    } catch (error) {
        res.status(500).json({ message: "Error While Fetching Sellers", error: error.message });
    }
}

module.exports = { browseSellers }
