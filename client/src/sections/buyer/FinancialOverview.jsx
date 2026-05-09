
const FinancialOverview = () => {
    return (
        <div className="space-y-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Spending', value: '$12,450.00', change: '+8.5%', color: 'text-emerald-500' },
                    { label: 'Pending Orders', value: '$800.00', change: '2 active', color: 'text-yellow-500' },
                    { label: 'Completed Purchases', value: '32', change: '+5 this month', color: 'text-emerald-500' },
                    { label: 'Active Requests', value: '7', change: 'Open', color: 'text-blue-500' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-2xl">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-neutral-800 ${stat.color}`}>{stat.change}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 bg-neutral-900/30 border border-neutral-800 rounded-2xl space-y-6">
                    <h3 className="text-lg font-bold text-white">Spending Overview</h3>
                    <div className="h-64 flex items-end justify-between gap-2 pt-4">
                        {[30, 60, 40, 80, 55, 75, 90, 45, 65, 40, 70, 85].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/10 to-emerald-500/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                <div className="p-8 bg-neutral-900/30 border border-neutral-800 rounded-2xl space-y-6">
                    <h3 className="text-lg font-bold text-white">Recent Purchases</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-black rounded-xl border border-neutral-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
                                        <span className="text-[10px] text-neutral-500">#{i}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Order #{5000 + i}</p>
                                        <p className="text-[10px] text-neutral-500">Apr 12, 2026</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-red-500">-$120.00</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3 border border-neutral-800 hover:border-emerald-500/50 text-xs font-bold text-neutral-400 hover:text-white rounded-lg transition-all">
                        View Purchase History
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinancialOverview
