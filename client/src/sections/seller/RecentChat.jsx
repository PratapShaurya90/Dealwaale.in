import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMessageSquare, FiClock, FiMapMarkerAlt, FiChevronRight } from "react-icons/fi";

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
                    if (!grouped[partnerId] || new Date(msg.timestamp || msg.createdAt) > new Date(grouped[partnerId].timestamp || grouped[partnerId].createdAt)) {
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
        const d = new Date(date);
        const now = new Date();
        const diff = (now - d) / 1000;

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (loading) return <div className="p-20 text-center font-black text-emerald-950 uppercase tracking-widest animate-pulse">Establishing Secure Trade Lines...</div>;

    return (
        <div className="w-full flex flex-col gap-8 pb-10">
            <div className="w-full">
                <h1 className="text-8xl font-black uppercase tracking-tighter text-emerald-950">Recent Chats</h1>
                <p className="text-xl font-bold text-neutral-500 uppercase tracking-wide">Manage your active trade negotiations and buyer inquiries</p>
            </div>

            <div className="w-full flex flex-col gap-4">
                {chats.length === 0 ? (
                    <div className="w-full h-96 bg-neutral-50 rounded-[3rem] border-2 border-dashed border-neutral-200 flex flex-col justify-center items-center gap-4 text-center p-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-neutral-300 shadow-xl border border-neutral-100">
                            <FiMessageSquare size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-neutral-400 uppercase tracking-tighter">No Active Conversations</h3>
                            <p className="text-sm font-bold text-neutral-300 uppercase tracking-widest mt-1">Visit Browse Dealer to start a trade inquiry</p>
                        </div>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => navigate(`/chat/${chat._id}`)}
                            className="w-full bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-emerald-900/5 hover:border-emerald-200 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden"
                        >
                            {/* Decorative Brand Accent */}
                            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {/* Partner Profile */}
                            <div className="flex items-center gap-6 flex-1 w-full">
                                <div className="w-24 h-24 rounded-3xl bg-emerald-950 text-white flex items-center justify-center font-black text-3xl uppercase shadow-2xl relative shrink-0">
                                    {chat.username?.substring(0, 2)}
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-emerald-950 rounded-full animate-pulse" />
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-3xl font-black text-emerald-950 uppercase tracking-tighter group-hover:text-emerald-600 transition-colors truncate">
                                                {chat.username}
                                            </h3>
                                            {chat.subscriptionType === 'pro' && (
                                                <span className="bg-yellow-400 text-emerald-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                                    Verified Partner
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-neutral-400">
                                            <div className="flex items-center gap-1.5">
                                                <FiMapMarkerAlt size={12} className="text-emerald-600" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{chat.city || 'Location Pending'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FiClock size={12} className="text-emerald-600" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{formatTime(chat.lastMessageAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 group-hover:bg-emerald-50/50 transition-colors">
                                        <p className="text-sm font-bold text-neutral-600 line-clamp-1 italic">
                                            "{chat.lastMessage || "Click to open conversation history..."}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Indicators */}
                            <div className="flex items-center gap-6 pr-4">
                                <div className="text-right hidden lg:block">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Direct Line</p>
                                    <p className="text-xs font-black text-emerald-950 uppercase">Active</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-emerald-950 group-hover:text-white transition-all shadow-inner">
                                    <FiChevronRight size={24} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RecentChat;
