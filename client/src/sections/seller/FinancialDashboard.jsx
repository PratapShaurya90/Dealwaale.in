import { useState, useEffect } from "react"
import axios from "axios"
import { FaChartLine, FaMapMarkerAlt, FaCalendarAlt, FaTable } from "react-icons/fa"

const FinancialDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [deals, setDeals] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUnits: 0,
        dealCount: 0,
        avgValue: 0
    });
    const [regionalData, setRegionalData] = useState([]);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/deals/seller", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` }
                });
                const fetchedDeals = res.data.deals;
                setDeals(fetchedDeals);

                // Calculate Stats
                const revenue = fetchedDeals.reduce((acc, d) => acc + (d.price * d.units), 0);
                const units = fetchedDeals.reduce((acc, d) => acc + d.units, 0);
                setStats({
                    totalRevenue: revenue,
                    totalUnits: units,
                    dealCount: fetchedDeals.length,
                    avgValue: fetchedDeals.length > 0 ? (revenue / fetchedDeals.length).toFixed(0) : 0
                });

                // Regional Analysis (Last 2 Months)
                const regionMap = {};
                fetchedDeals.forEach(d => {
                    regionMap[d.city] = (regionMap[d.city] || 0) + (d.price * d.units);
                });
                const sortedRegions = Object.entries(regionMap)
                    .map(([city, val]) => ({ city, val }))
                    .sort((a, b) => b.val - a.val);
                setRegionalData(sortedRegions);

            } catch (err) {
                console.error("Error fetching deals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    if (loading) return <div className="p-8 text-xs font-bold text-neutral-400">LOADING FINANCIAL DATA...</div>;

    return (
        <div className="bg-[#fcfcfc] min-h-screen p-4 text-neutral-800 font-sans">
            
            {/* Header / Filter Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-black uppercase tracking-tighter">Financial Ledger</h1>
                    <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 text-neutral-500 font-bold">RE-092-2026</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex border border-neutral-200 rounded overflow-hidden">
                        <button className="px-3 py-1 text-[10px] font-bold bg-white border-r border-neutral-200 hover:bg-neutral-50">1D</button>
                        <button className="px-3 py-1 text-[10px] font-bold bg-white border-r border-neutral-200 hover:bg-neutral-50">1W</button>
                        <button className="px-3 py-1 text-[10px] font-bold bg-neutral-900 text-white">1M</button>
                        <button className="px-3 py-1 text-[10px] font-bold bg-white hover:bg-neutral-50">ALL</button>
                    </div>
                    <button className="px-3 py-1 text-[10px] font-bold bg-white border border-neutral-200 rounded flex items-center gap-1.5 hover:bg-neutral-50">
                        <FaCalendarAlt size={10} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Metric Grid - Minimalist Spreadsheet Style */}
            <div className="grid grid-cols-4 gap-0 border border-neutral-200 bg-white mb-8 shadow-sm">
                {[
                    { label: 'GROSS REVENUE', value: `₹${stats.totalRevenue.toLocaleString()}`, change: '+12.5%' },
                    { label: 'UNITS DISPATCHED', value: stats.totalUnits.toLocaleString(), change: '+8.2%' },
                    { label: 'TOTAL ENTRIES', value: stats.dealCount, change: '+14' },
                    { label: 'AVG DEAL VALUE', value: `₹${stats.avgValue}`, change: '-2.1%' }
                ].map((m, i) => (
                    <div key={i} className={`p-5 flex flex-col gap-1 ${i < 3 ? 'border-r border-neutral-200' : ''}`}>
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{m.label}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold tracking-tighter">{m.value}</span>
                            <span className={`text-[9px] font-bold ${m.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{m.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
                
                {/* Left Panel: Regional Performance */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white border border-neutral-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                                <FaMapMarkerAlt /> Top Sales Regions
                            </h3>
                            <button className="text-[9px] font-bold text-neutral-400 hover:text-neutral-950 transition-colors">DETAILS</button>
                        </div>
                        <div className="space-y-4">
                            {regionalData.length > 0 ? regionalData.map((reg, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                        <span>{reg.city}</span>
                                        <span className="text-neutral-400">₹{(reg.val / 1000).toFixed(1)}K</span>
                                    </div>
                                    <div className="w-full h-1 bg-neutral-50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-neutral-900 transition-all duration-1000" 
                                            style={{ width: `${(reg.val / stats.totalRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[10px] italic text-neutral-300">No regional data recorded yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                                <FaChartLine /> Inventory Velocity
                            </h3>
                        </div>
                        <div className="h-32 flex items-end justify-between gap-1">
                            {[20, 45, 30, 60, 40, 80, 55, 90, 35, 70, 50, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-neutral-100 hover:bg-neutral-900 transition-colors" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
                            <span>SEP 25</span>
                            <span>OCT 25</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Transaction Ledger */}
                <div className="col-span-8 bg-white border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-5 bg-neutral-50 border-b border-neutral-200">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                            <FaTable /> Transaction Ledger
                        </h3>
                        <div className="flex gap-4 items-center">
                            <input type="text" placeholder="Filter by product..." className="bg-white border border-neutral-200 px-3 py-1 rounded text-[9px] outline-none focus:border-neutral-400 w-48" />
                            <span className="text-[9px] font-bold text-neutral-400">SORT BY: NEWEST</span>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                {['Date', 'Reference', 'Region', 'Units', 'Revenue', 'Status'].map(h => (
                                    <th key={h} className="px-5 py-2.5 text-[9px] font-black text-neutral-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {deals.length > 0 ? deals.map((deal, idx) => (
                                <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-3 text-[10px] font-bold text-neutral-500">
                                        {new Date(deal.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-neutral-900 uppercase">{deal.productName}</span>
                                            <span className="text-[8px] font-bold text-neutral-300 uppercase">ID-{deal._id.substring(deal._id.length - 6)}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-[10px] font-bold text-neutral-600 uppercase tracking-tight">{deal.city}</td>
                                    <td className="px-5 py-3 text-[10px] font-bold text-neutral-900">{deal.units} PCS</td>
                                    <td className="px-5 py-3 text-[10px] font-bold text-emerald-600">₹{(deal.price * deal.units).toLocaleString()}</td>
                                    <td className="px-5 py-3">
                                        <span className="text-[8px] font-black px-2 py-0.5 rounded border border-neutral-200 uppercase tracking-widest text-neutral-400 bg-white">
                                            {deal.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-5 py-10 text-center text-[10px] font-bold text-neutral-300 italic uppercase">
                                        No manual trade entries found in ledger.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default FinancialDashboard
