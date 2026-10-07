const Message = require('../model/shared/Message');

const saveMessage = async (senderId, receiverId, message) => {
    try{
        const newMsg = new Message({senderId,receiverId,message});
        await newMsg.save();
        return newMsg;
    }catch(error){
        console.error("Error saving message:", error);
        throw error;
    }

}

const getRecentChatList = async (userId) => {
    // Finds all messages where user is sender or receiver, populates partner info, and groups them
    return await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
        .populate({ path: 'senderId', select: 'username email profilePic city subscriptionType' })
        .populate({ path: 'receiverId', select: 'username email profilePic city subscriptionType' })
        .sort({ timestamp: -1 });
};
const getChatHistory = async (user1, user2) => {
    return await Message.find({
        $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 }
        ]
    }).sort({ timestamp: 1 }); // Oldest first for chat window
};

module.exports = { saveMessage, getRecentChatList, getChatHistory }
