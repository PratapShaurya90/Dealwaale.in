const TicketBaseBuyer = require("../../model/buyer/ticketBaseBuyer")

const tickets = async (req, res) => {
    try {
        const { companyName, productType, productName, productImages, companyLocation, pricePerProduct, phoneNumber, email, supplyType } = req.body
        const ticket = await TicketBaseBuyer.create({
            userId: req.user.id,
            companyName,
            productType,
            productName,
            productImages,
            companyLocation,
            pricePerProduct,
            phoneNumber,
            email,
            supplyType
        })

        res.status(200).json({
            message: "Buyer Ticket Created Successfully",
            ticket
        })

    } catch (error) {
        res.status(500).json({ message: "Error While Creating Ticket" })
    }
}

module.exports = { tickets }
