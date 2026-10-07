const TicketBase = require("../../model/seller/ticketBase")

const createTicket = async (req, res) => {
    try {
        const { companyName, productType, productName, productImages, companyLocation, pricePerProduct, phoneNumber, email, supplyType, units, city } = req.body
        if(!companyName || !productType || !productName || !productImages || !companyLocation || !pricePerProduct || !phoneNumber || !supplyType){
            return res.status(400).json(
                {
                    message: "All Fields are Required"
                }
            )
        }
        
        const ticket = await TicketBase.create({
            userId: req.user?.id,
            companyName,
            productType,
            productName,
            productImages,
            companyLocation,
            pricePerProduct,
            phoneNumber,
            email,
            supplyType,
            units: units || 0,
            city: city || companyLocation
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
