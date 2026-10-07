import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Image from "../../assets/Backsgreene.png";

const FinancialOverview = () => {
    const [timeframe, setTimeframe] = useState('1m');
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChatbot, setShowChatbot] = useState(false);
    const [aiMessages, setAiMessages] = useState([]);
    const [aiInput, setAiInput] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const aiScrollRef = useRef();

    const renderMarkdown = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part.split('\n').map((line, j, arr) => (
                <span key={`${i}-${j}`}>{line}{j < arr.length - 1 ? <br /> : null}</span>
            ));
        });
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('Token');
            const res = await axios.get(`http://localhost:5000/api/deals/buyer-analytics?timeframe=${timeframe}&page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching analytics', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnalytics(); }, [timeframe, page]);
    useEffect(() => { aiScrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

    const handleAiSend = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;
        const userMsg = { role: 'user', content: aiInput };
        const newMessages = [...aiMessages, userMsg];
        setAiMessages(newMessages);
        setAiInput('');
        setLoadingAI(true);
        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    systemInstruction: "You are a highly analytical AI Financial Assistant for a B2B platform buyer. The user will ask you about their spending, units bought, and financial data. Calculate mathematically when requested. Be concise, professional, and focus purely on the financial data facts. Provide simple, easy-to-read numbers. FORMATTING RULE: Do not use markdown like asterisks (**). Format using clean line breaks and bullet points (-) for readability."
                })
            });
            if (!response.ok) throw new Error('Failed');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            setAiMessages(prev => [...prev, { role: 'ai', content: '' }]);
            setLoadingAI(false);
            let acc = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                acc += decoder.decode(value, { stream: true });
                setAiMessages(prev => {
                    const last = prev[prev.length - 1];
                    return [...prev.slice(0, -1), { ...last, content: acc }];
                });
            }
        } catch {
            setAiMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to AI.' }]);
            setLoadingAI(false);
        }
    };

    const timeFilters = [
        { label: '1D', value: '1d' },
        { label: '5D', value: '5d' },
        { label: '10D', value: '10d' },
        { label: '1M', value: '1m' },
        { label: '3M', value: '3m' },
        { label: '1Y', value: '1y' },
    ];

    const metrics = [
        { label: 'Units Bought', value: data?.metrics?.totalUnits ?? 0, fmt: v => v.toLocaleString(), tag: 'TOTAL' },
        { label: 'Total Spent', value: data?.metrics?.totalSpent ?? 0, fmt: v => `₹${v.toLocaleString()}`, tag: 'GROSS' },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ border: '1px solid #e5e5e5', background: '#fff', padding: '12px 16px', fontSize: 11, fontFamily: 'inherit' }}>
                    <p style={{ color: '#888', marginBottom: 6, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    {payload.map(p => (
                        <p key={p.dataKey} style={{ color: '#111', fontWeight: 600 }}>
                            {p.name}: ₹{Number(p.value).toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 relative" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}>

            {/* Top Bar */}
            <div className="bg-white border-b border-neutral-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] font-semibold mb-0.5">Buyer Dashboard</div>
                        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Purchase Overview</h1>
                    </div>
                    {/* Timeframe filters in header */}
                    <div className="flex items-center gap-1 ml-6 bg-neutral-100 p-1">
                        {timeFilters.map(tf => (
                            <button
                                key={tf.value}
                                onClick={() => { setTimeframe(tf.value); setPage(1); }}
                                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all ${timeframe === tf.value
                                        ? 'bg-white text-neutral-900 border border-neutral-200'
                                        : 'text-neutral-500 hover:text-neutral-700'
                                    }`}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setShowChatbot(!showChatbot)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-all ${showChatbot
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-600'
                        }`}
                >
                    <span className="w-1.5 h-1.5 bg-current inline-block"></span>
                    AI Assistant
                </button>
            </div>

            <div className="px-8 py-8 flex flex-col gap-8">

                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-0 border border-neutral-200 bg-white divide-x divide-neutral-200">
                    {metrics.map((m) => (
                        <div key={m.label} className="px-6 py-6 flex flex-col gap-3 relative">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">{m.label}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-300 border border-neutral-200 px-1.5 py-0.5">{m.tag}</span>
                            </div>
                            {loading ? (
                                <div className="h-8 w-32 bg-neutral-100 animate-pulse"></div>
                            ) : (
                                <span className="text-3xl font-bold text-neutral-900 tracking-tight tabular-nums">{m.fmt(m.value)}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className="bg-white border border-neutral-200">
                    <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">Purchases Over Time</span>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
                                <span className="w-2.5 h-2.5 bg-emerald-700 inline-block"></span>Total Spent
                            </span>
                        </div>
                    </div>
                    <div className="p-6 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.chartData || []} margin={{ top: 5, right: 0, left: -15, bottom: 5 }} barCategoryGap="35%">
                                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#000', fontFamily: 'inherit', fontWeight: 'bold' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#000', fontFamily: 'inherit', fontWeight: 'bold' }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, Math.max(10000000, (data?.metrics?.totalSpent || 0))]}
                                    tickFormatter={v => `₹${v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fafafa' }} />
                                <Bar dataKey="spent" fill="#10b981" radius={0} name="Total Spent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-neutral-200">
                    <div className="px-6 py-4 border-b border-neutral-100">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">Purchase Records</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50">
                                    {['#', 'Product', 'Units', 'Price / Unit', 'Total Paid', 'Seller', 'Role', 'Location'].map(h => (
                                        <th key={h} className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400 border-b border-neutral-100">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {!data?.table?.deals?.length ? (
                                    <tr>
                                        <td colSpan="8" className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 text-neutral-300">
                                                <p className="text-[10px] uppercase tracking-widest">No purchases recorded in this timeframe</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.table.deals.map((deal, i) => {
                                        const row = ((page - 1) * 10) + i + 1;
                                        return (
                                            <tr key={deal._id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors group">
                                                <td className="px-5 py-4 text-[10px] text-neutral-400 font-mono">{String(row).padStart(2, '0')}</td>
                                                <td className="px-5 py-4 text-sm font-semibold capitalize text-neutral-900">{deal.productName}</td>
                                                <td className="px-5 py-4 text-sm text-neutral-600 tabular-nums">{deal.units}</td>
                                                <td className="px-5 py-4 text-sm text-neutral-600 tabular-nums font-mono">₹{deal.price.toLocaleString()}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-neutral-900 tabular-nums font-mono">₹{(deal.price * deal.units).toLocaleString()}</td>
                                                <td className="px-5 py-4 text-sm capitalize text-neutral-700">{deal.sellerId?.username || '—'}</td>
                                                <td className="px-5 py-4 text-xs text-neutral-400 capitalize">{deal.sellerId?.profession || '—'}</td>
                                                <td className="px-5 py-4 text-xs text-neutral-400">{deal.city || '—'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data?.table?.totalPages > 1 && (
                        <div className="px-6 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
                                {((page - 1) * 10) + 1}–{Math.min(page * 10, data.table.total)} of {data.table.total} records
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="px-3 py-1.5 text-xs border border-neutral-200 text-neutral-600 disabled:opacity-30 hover:bg-neutral-100 hover:border-neutral-300 transition-all font-medium"
                                >
                                    ← Prev
                                </button>
                                <span className="px-3 py-1.5 text-xs border border-neutral-200 bg-neutral-900 text-white font-medium">
                                    {page}
                                </span>
                                <button
                                    disabled={page === data.table.totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-3 py-1.5 text-xs border border-neutral-200 text-neutral-600 disabled:opacity-30 hover:bg-neutral-100 hover:border-neutral-300 transition-all font-medium"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* AI Chatbot Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-white border-l border-neutral-200 flex flex-col z-[200] transition-all duration-300 ${showChatbot ? 'w-[400px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="w-full h-auto border-b border-gray-400 p-5 flex items-center justify-center shrink-0 relative">
                    <p className="text-gray-950 text-md italic cursive">AI Assistant</p>
                    <button onClick={() => setShowChatbot(false)} className="absolute right-5 text-gray-500 hover:text-black text-xl">×</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white relative">
                    {aiMessages.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center relative">
                            <img src={Image} alt="AI Assistant" className="opacity-50" />
                            <p className="absolute inset-0 flex items-center cursive justify-center text-gray-900 text-2xl text-center font-light italic">
                                Your Financial AI<br />Ask me Anything
                            </p>
                        </div>
                    ) : (
                        aiMessages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2 text-sm whitespace-pre-wrap ${m.role === 'user'
                                        ? 'bg-green-950 text-white font-medium rounded-2xl'
                                        : 'bg-white font-medium text-black rounded-xl border border-neutral-200 shadow-sm'
                                    }`}>
                                    {m.role === 'ai' ? renderMarkdown(m.content) : m.content}
                                </div>
                            </div>
                        ))
                    )}
                    {loadingAI && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-neutral-200 shadow-sm rounded-lg px-4 py-2 text-sm italic text-gray-500 animate-pulse">Thinking...</div>
                        </div>
                    )}
                    <div ref={aiScrollRef} />
                </div>

                <div className="w-full p-4 border-t border-black bg-white shrink-0">
                    <form onSubmit={handleAiSend} className="w-full flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5">
                        <textarea
                            value={aiInput}
                            onChange={e => setAiInput(e.target.value)}
                            placeholder="Ask AI anything..."
                            className="flex-1 h-12 bg-transparent text-sm text-gray-800 outline-none py-1.5 resize-none scrollbar-hide"
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
                            {loadingAI ? '...' : 'Ask'}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default FinancialOverview;
