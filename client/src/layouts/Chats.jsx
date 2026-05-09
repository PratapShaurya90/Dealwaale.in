import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import Image from "../assets/Backsgreene.png";

const Chat = () => {
    const { id: partnerId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [partnerInfo, setPartnerInfo] = useState(null);
    const [aiMessages, setAiMessages] = useState([]);
    const [input, setInput] = useState("");
    const [aiInput, setAiInput] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const [back, setBack] = useState(true);
    const [showDealModal, setShowDealModal] = useState(false);
    const [dealData, setDealData] = useState({
        productName: "",
        price: "",
        units: ""
    });
    const [savingDeal, setSavingDeal] = useState(false);

    const scrollRef = useRef();
    const aiScrollRef = useRef();
    const socketRef = useRef();

    const myUser = JSON.parse(localStorage.getItem("User"));
    const myId = myUser?.id || myUser?._id;

    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = () => setIsResizing(true);
    const stopResizing = () => setIsResizing(false);
    const resize = (e) => { if (isResizing) setSidebarWidth(e.clientX); };

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing]);

    useEffect(() => {
        if (!socketRef.current && myId) {
            socketRef.current = io("http://localhost:5000", {
                query: { userId: myId }
            });
        }

        const socket = socketRef.current;
        if (!socket) return;

        const fetchChatData = async () => {
            try {
                const historyRes = await axios.get(`http://localhost:5000/api/chat/history/${partnerId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` }
                });
                setMessages(historyRes.data.data);

                const partnerRes = await axios.get(`http://localhost:5000/api/auth/${partnerId}`);
                setPartnerInfo(partnerRes.data.data);
            } catch (error) {
                console.error("Error fetching chat data:", error);
            }
        };

        if (partnerId) {
            fetchChatData();
            socket.emit("join_chat", { myId, partnerId });
        }

        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => { socket.off("receive_message"); }
    }, [partnerId, myId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        aiScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        socketRef.current?.emit("send_message", {
            senderId: myId,
            receiverId: partnerId,
            message: input
        });
        setInput("");
    };

    const handleAiSend = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;

        const userMsg = { role: "user", content: aiInput };
        const newMessages = [...aiMessages, userMsg];
        setAiMessages(newMessages);
        setAiInput("");
        setBack(false);
        setLoadingAI(true);

        try {
            const response = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages })
            });

            if (!response.ok) throw new Error("Failed to connect to AI");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Add a placeholder message for the AI
            setAiMessages((prev) => [...prev, { role: "ai", content: "" }]);
            setLoadingAI(false);

            let accumulatedText = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                setAiMessages((prev) => {
                    const lastMsg = prev[prev.length - 1];
                    return [...prev.slice(0, -1), { ...lastMsg, content: accumulatedText }];
                });
            }

        } catch (error) {
            console.error("AI Chat Error:", error);
            setAiMessages((prev) => [...prev, { role: "ai", content: "Sorry, I'm having trouble connecting to my brain right now." }]);
            setLoadingAI(false);
        }
    };

    const handleSaveDeal = async (e) => {
        e.preventDefault();
        setSavingDeal(true);
        try {
            await axios.post("http://localhost:5000/api/deals", {
                buyerId: partnerId,
                productName: dealData.productName,
                price: Number(dealData.price),
                units: Number(dealData.units),
                city: partnerInfo?.city || "Unknown",
                category: partnerInfo?.categories?.[0] || "General"
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` }
            });
            setShowDealModal(false);
            navigate(-1);
        } catch (error) {
            console.error("Error saving deal:", error);
            alert("Failed to save deal. Navigating back anyway.");
            navigate(-1);
        } finally {
            setSavingDeal(false);
        }
    };

    const handleBackClick = () => {
        // Only ask to record deal if messages exist and we are a seller
        const user = JSON.parse(localStorage.getItem("User"));
        if (messages.length > 0 && user?.role === 'seller') {
            setShowDealModal(true);
        } else {
            navigate(-1);
        }
    };


    return (
        <div className="w-full h-screen flex">
            {/* Sidebar: AI Chat */}
            <div
                style={{ width: `${sidebarWidth}px` }}
                className="h-screen bg-white flex flex-col overflow-hidden relative border-r-4 border-gray-200"
            >
                <div onMouseDown={startResizing} className="absolute right-0 top-0 w-1.5 h-full cursor-col-resize z-50 hover:bg-emerald-500 active:bg-emerald-600 transition-colors" />

                <div className="w-full h-auto border-b border-gray-400 p-5 flex items-center justify-center">
                    <p className="text-gray-950 text-md italic cursive">AI Assistant</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
                    {back ? (
                        <div className="w-full h-full flex items-center justify-center relative">
                            <img src={Image} alt="AI Assistant" className="opacity-50" />
                            <p className="absolute inset-0 flex items-center cursive justify-center text-gray-900 text-2xl text-center font-light italic">
                                Your AI Assistant<br />Ask me Anything
                            </p>
                        </div>
                    ) : (
                        aiMessages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] px-4 py-2 text-sm ${m.role === "user"
                                        ? "bg-green-950 text-white font-medium rounded-2xl"
                                        : "bg-white font-medium text-black rounded-xl"
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))
                    )}
                    {loadingAI && (
                        <div className="flex justify-start">
                            <div className="bg-white text-black shadow-sm rounded-lg px-4 py-2 text-sm italic animate-pulse">
                                Thinking...
                            </div>
                        </div>
                    )}

                    <div ref={aiScrollRef} />
                </div>

                <div className="w-full p-4 border-t border-gray-100">
                    <form onSubmit={handleAiSend} className="w-full flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5">
                        <textarea
                            placeholder="Ask AI anything..."
                            className="flex-1 bg-transparent text-sm text-gray-800 outline-none py-1.5 resize-none h-12 scrollbar-hide"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            onFocus={() => setBack(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAiSend(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loadingAI}
                            className="bg-emerald-950 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-800 transition-all disabled:opacity-50"
                        >
                            {loadingAI ? "..." : "Ask"}
                        </button>

                    </form>
                </div>
            </div>

            {/* Main Chat: User to User */}
            <div className="flex-1 h-full flex flex-col relative" style={{ backgroundColor: "#efeae2", backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundBlendMode: "multiply", backgroundSize: "400px", opacity: "0.9" }}>
                <div className="p-4 flex items-center gap-4 bg-white/90 backdrop-blur-md justify-between border-b border-neutral-200 z-10">
                    <div className="flex items-center gap-2">
                        <button onClick={handleBackClick} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <FiArrowLeft size={20} className="text-neutral-700" />
                        </button>
                        <span className="text-emerald-950 font-black uppercase tracking-widest text-[10px]">Back</span>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-emerald-950 text-sm font-black uppercase tracking-tight">
                            {partnerInfo ? partnerInfo.username : "Connecting..."}
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${String(m.senderId) === String(myId) ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] px-4 py-2.5 shadow-sm text-[14px] leading-relaxed relative ${String(m.senderId) === String(myId)
                                ? "bg-emerald-900 text-white rounded-l-2xl rounded-br-2xl rounded-tr-none"
                                : "bg-white text-gray-900 rounded-r-2xl rounded-bl-2xl rounded-tl-none border border-neutral-100"
                                }`}>
                                {m.message}
                                <div className={`text-[9px] text-right mt-1 font-bold ${String(m.senderId) === String(myId) ? "text-emerald-200/60" : "text-neutral-400"}`}>
                                    {new Date(m.timestamp || m.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-neutral-200/50">
                    <form onSubmit={handleSend} className="w-full mx-auto flex gap-3 items-center">
                        <textarea
                            className="flex-1 bg-white border border-neutral-200 rounded-2xl px-4 py-3 outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-100 resize-none h-12 text-sm shadow-sm transition-all"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                        />
                        <button type="submit" className="bg-emerald-950 text-white w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-emerald-800 active:scale-95 transition-all shadow-2xl">
                            <FiSend size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Deal Recording Modal */}
            {showDealModal && (
                <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-neutral-200">
                        <div className="bg-neutral-50 p-6 border-b border-neutral-200 text-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-950">Record Transaction?</h3>
                            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase">Log this deal in your financial ledger</p>
                        </div>
                        <form onSubmit={handleSaveDeal} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Product Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-neutral-900"
                                    value={dealData.productName}
                                    onChange={(e) => setDealData({...dealData, productName: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Price (per unit)</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-neutral-900"
                                        value={dealData.price}
                                        onChange={(e) => setDealData({...dealData, price: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Total Units</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-neutral-900"
                                        value={dealData.units}
                                        onChange={(e) => setDealData({...dealData, units: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                                <button 
                                    type="submit"
                                    disabled={savingDeal}
                                    className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50"
                                >
                                    {savingDeal ? "Recording..." : "Save Entry"}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full py-3 text-neutral-400 text-[10px] font-black uppercase tracking-widest hover:text-neutral-900"
                                >
                                    Skip & Exit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;