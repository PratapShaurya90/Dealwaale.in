const User = require("../../model/shared/user")

const sellerProfile = async (req, res) => {
    try {
        const user = req.user;

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

module.exports = { sellerProfile }
