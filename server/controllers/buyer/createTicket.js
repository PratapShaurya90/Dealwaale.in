const TicketBaseBuyer = require("../../model/buyer/ticketBaseBuyer")

const createTicket = async (req, res) => {
    try {
        const { companyName, productType, productName, productImages, companyLocation, pricePerProduct, phoneNumber, email, supplyType } = req.body
        if(!companyName || !productType || !productName || !companyLocation || !pricePerProduct || !phoneNumber  || !supplyType){
            return res.status(400).json(
                {
                    message: "All Fields are Required"
                }
            )
        }
        const ticket = await TicketBaseBuyer.create({
            userId: req.user?.id,
            companyName,
            productType,
            productName,
            companyLocation,
            pricePerProduct,
            phoneNumber,
            email,
            supplyType
        })

        res.status(200).json(
            {
                message: "Ticket created successfully",
                ticket
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                message: "Error While Creating Ticket"
            }
        )
    }
}

module.exports = { createTicket }