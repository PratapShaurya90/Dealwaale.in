const TicketBaseBuyer = require("../../model/buyer/ticketBaseBuyer")

const getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const requests = await TicketBaseBuyer.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tickets: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
}

const deleteRequest = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { id } = req.params;
        const request = await TicketBaseBuyer.findOneAndDelete({ _id: id, userId });
        
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found or unauthorized" });
        }
        res.status(200).json({ success: true, message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting request", error: error.message });
    }
}

module.exports = { getMyRequests, deleteRequest }
