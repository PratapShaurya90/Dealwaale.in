const User = require('../../model/shared/user')

const browseDealer = async (req, res) => {
    try {
        const { search, category, city } = req.query;
        let query = { role: "buyer" };

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

        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit
        const [dealers, total] = await Promise.all([
            User.find(query).limit(limit).skip(skip).select("-password"),
            User.countDocuments(query)
        ]);

        if (dealers.length === 0) {
            return res.status(404).json({ message: "No Dealers Found at the Moment" })
        }

        res.status(200).json({
            message: "Dealers Found Successfully",
            dealers,
            page,
            totalPages: Math.ceil(total / limit)
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { browseDealer }
