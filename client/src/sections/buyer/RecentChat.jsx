import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMessageSquare, FiClock, FiMapPin, FiChevronRight } from "react-icons/fi";

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
                if (msg.senderId?._id && msg.receiverId?._id && String(msg.senderId._id) === String(msg.receiverId._id)) {
                    return;
                }
                const isSender = String(msg.senderId?._id) === String(myId);
                const partner = isSender ? msg.receiverId : msg.senderId;

                if (partner && partner._id) {
                    const partnerId = String(partner._id);
                    if (!grouped[partnerId] || new Date(msg.timestamp || msg.createdAt) > new Date(grouped[partnerId].lastMessageAt)) {
                        grouped[partnerId] = {
                            ...partner,
                            lastMessage: msg.message,
                            lastMessageAt: msg.timestamp || msg.createdAt
                        };
                    }
                }
            });

            setChats(Object.values(grouped).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
        } catch (error) {
            console.error("Error fetching recent chats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentChats();
    }, []);

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = (now - d) / 1000;

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Recent Chats</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your active negotiations and seller inquiries</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FiMessageSquare className="text-gray-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
                        <p className="text-sm text-gray-500 mt-1">When you connect with sellers, your conversations will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => navigate(`/chat/${chat._id}`)}
                                className="w-full p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex items-center gap-4 group"
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-lg">
                                        {chat.username?.substring(0, 2).toUpperCase() || "U"}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                                {chat.username || "Unknown Seller"}
                                            </h3>
                                            {chat.subscriptionType === 'pro' && (
                                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                                    Pro
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                            {formatTime(chat.lastMessageAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <p className="truncate flex-1">
                                            {chat.lastMessage || "Click to open conversation..."}
                                        </p>
                                        {chat.city && (
                                            <div className="flex items-center gap-1 shrink-0 text-xs text-gray-400 hidden sm:flex">
                                                <FiMapPin size={12} />
                                                <span>{chat.city}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0 ml-4">
                                    <FiChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecentChat;
