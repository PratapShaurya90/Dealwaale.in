const TicketBase = require("../../model/seller/ticketBase")

const quickSellers = async (req, res) => {
    try {
        // Buyers want to see tickets created by ALL sellers
        const tickets = await TicketBase.find({}).populate('userId', 'username city');
        
        res.status(200).json({
            success: true,
            tickets
        });

    } catch (error) {
        res.status(500).json({ message: "Error While Finding Seller Tickets" });
    }
}

module.exports = { quickSellers }
