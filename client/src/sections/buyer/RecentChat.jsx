import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMessageSquare, FiUser, FiClock } from "react-icons/fi";

const RecentChat = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const myUser = JSON.parse(localStorage.getItem("User"));
    const myId = myUser?.id || myUser?._id;

    const fetchRecentChats = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/chat/recent", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`
                }
            });
            
            const messages = response.data.data;
            const grouped = {};
            
            messages.forEach(msg => {
                // Filter out self-chats
                if (msg.senderId?._id && msg.receiverId?._id && String(msg.senderId._id) === String(msg.receiverId._id)) {
                    return;
                }
                const isSender = String(msg.senderId?._id) === String(myId);
                const partner = isSender ? msg.receiverId : msg.senderId;
                
                if (partner && partner._id) {
                    const partnerId = String(partner._id);
                    if (!grouped[partnerId] || new Date(msg.timestamp || msg.createdAt) > new Date(grouped[partnerId].timestamp || grouped[partnerId].createdAt)) {
                        grouped[partnerId] = {
                            ...partner,
                            lastMessage: msg.message,
                            createdAt: msg.timestamp || msg.createdAt
                        };
                    }
                }
            });

            setChats(Object.values(grouped).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error("Error fetching recent chats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentChats();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading chats...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-emerald-950 mb-6">Recent Conversations</h1>
            
            <div className="space-y-3">
                {chats.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl border border-dashed border-neutral-300 text-center text-neutral-500">
                        <FiMessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No recent chats found. Start a conversation with a seller!</p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div 
                            key={chat._id}
                            onClick={() => navigate(`/chat/${chat._id}`)}
                            className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                {chat.username?.substring(0, 2).toUpperCase()}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-emerald-950 truncate">{chat.username}</h3>
                                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                        <FiClock size={10} />
                                        {new Date(chat.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-500 truncate mt-0.5">
                                    {chat.lastMessage}
                                </p>
                            </div>
                            
                            <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiMessageSquare />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RecentChat;
