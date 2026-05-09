const profile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Buyer Profile Found Successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Error While Finding Profile" });
    }
}

module.exports = { profile }
