const TicketBaseBuyers = require("../../model/buyer/ticketBaseBuyer")

const quickBuys = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit
    const { minPrice, minUnits, city, productType, supplyType, search } = req.query;
    let query = {};

    if (minPrice) {
        query.pricePerProduct = { $gte: parseFloat(minPrice) };
    }

    if (minUnits) {
        query.units = { $gte: parseInt(minUnits) };
    }

    if (city) {
        query.$or = [
            { city: { $regex: city, $options: 'i' } },
            { companyLocation: { $regex: city, $options: 'i' } }
        ];
    }

    if (productType) {
        query.productType = productType;
    }

    if (supplyType) {
        query.supplyType = supplyType;
    }

    if (search) {
        query.$or = [
            { productName: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const ticket = await TicketBaseBuyers.find(query).select('userId companyName productType productName companyLocation pricePerProduct supplyType phoneNumber units city').sort({ createdAt: -1 }).limit(limit).skip(skip)
        const total = await TicketBaseBuyers.countDocuments(query)

        if(total === 0) {
            return res.status(404).json({ message: "No Tickets Found at the Moment" })
        }
        
        res.status(200).json(
            {
                message: "Ticket found successfully",
                ticket,
                page,
                totalPages: Math.ceil(total / limit)
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                message: "Error While Finding Ticket"
            }
        )
    }
}

module.exports = { quickBuys }
