const chatService = require("../services/chatService");
const chatSocket = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(userId);
            console.log('User connected:', userId, socket.id);
        }

        socket.on("send_message", async(data) => {
            const { senderId, receiverId, message } = data;
            const save= await chatService.saveMessage(senderId, receiverId, message);

            if(save) {
                io.to(receiverId).emit("receive_message", save);
                io.to(senderId).emit("receive_message", save);
                io.to(receiverId).emit('refresh_recent_list')

            }
        })
    })

}
module.exports = chatSocket;