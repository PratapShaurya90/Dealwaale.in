const chatService = require("../../services/chatService");

const getRecent = async (req, res) => {
    try {
        const userId = req.user.id;
        const recentList = await chatService.getRecentChatList(userId);
        res.status(200).json({ success: true, data: recentList });
    } catch (error) {
        console.error("Error getting recent chat list:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const partnerId = req.params.partnerId;
        const history = await chatService.getChatHistory(userId, partnerId);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        console.error("Error getting chat history:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getRecent, getHistory }