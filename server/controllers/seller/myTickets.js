const TicketBase = require("../../model/seller/ticketBase")

const getMyTickets = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const tickets = await TicketBase.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tickets", error: error.message });
    }
}

const deleteTicket = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { id } = req.params;
        const ticket = await TicketBase.findOneAndDelete({ _id: id, userId });
        
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found or unauthorized" });
        }
        res.status(200).json({ success: true, message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting ticket", error: error.message });
    }
}

module.exports = { getMyTickets, deleteTicket }
