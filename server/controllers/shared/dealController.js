const Deal = require('../../model/shared/Deal');
const User = require('../../model/shared/user');

const createDeal = async (req, res) => {
    try {
        const { buyerId, productName, price, units, city, category } = req.body;
        const sellerId = req.user.id;

        const newDeal = new Deal({
            sellerId,
            buyerId,
            productName,
            price,
            units,
            city,
            category
        });

        await newDeal.save();

        res.status(201).json({
            success: true,
            message: "Deal recorded successfully",
            deal: newDeal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSellerDeals = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const deals = await Deal.find({ sellerId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            deals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createDeal, getSellerDeals };
