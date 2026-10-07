import { FaFilter, FaLock, FaStar, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaTag, FaPhone } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const QuickSellers = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [tickets, setTickets] = useState([])
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [isPopUpOpen, setIsPopUpOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [expandedDealId, setExpandedDealId] = useState(null)
    const [filters, setFilters] = useState({
        search: "",
        minPrice: "",
        minUnits: "",
        city: "",
        productType: "",
        supplyType: ""
    })

    const productCategories = [
        "Clothings & Textiles", "Footwear", "Electronics & Mobiles",
        "Grocery & Kirana", "Hardware & Construction", "Automobile Parts",
        "Pharmacy & Healthcare", "Furniture & Home Decor", "Jewelry", "Stationery & Gifts"
    ];

    const supplyTypes = ["quick supply", "on demand", "Manufacturer", "Distributor"];

    const indianCities = [
        "Agra", "Ahmedabad", "Allahabad", "Amritsar", "Aurangabad", "Bangalore", 
        "Bhopal", "Chandigarh", "Chennai", "Coimbatore", "Delhi", "Dhanbad", 
        "Faridabad", "Ghaziabad", "Guwahati", "Gwalior", "Howrah", "Hyderabad", 
        "Indore", "Jabalpur", "Jaipur", "Jodhpur", "Kanpur", "Kolkata", "Kota", 
        "Lucknow", "Ludhiana", "Madurai", "Meerut", "Mumbai", "Nagpur", "Nashik", 
        "Navi Mumbai", "Patna", "Pune", "Raipur", "Rajkot", "Ranchi", "Solapur", 
        "Srinagar", "Surat", "Thane", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam"
    ];

    const priceRanges = [100, 200, 500, 1000, 2000, 5000, 10000];
    const unitRanges = [50, 100, 150, 200, 500, 1000, 5000];

    const fetchData = async (currentPage) => {
        setLoading(true)
        setError(null)
        try {
            const params = {
                page: currentPage,
                ...filters
            };

            const response = await axios.get(
                `http://localhost:5000/api/buyer/quicksellers`,
                {
                    params,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("Token")}`
                    }
                }
            )
            // Backend returns { success: true, tickets: [...] }
            setTickets(response.data.tickets)
            setTotalPages(response.data.totalPages || 1)
            setTotal(response.data.tickets.length || 0)
        } catch (error) {
            setError(error.response?.data?.message || error.message)
            setTickets([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(page)
    }, [page, filters])

    return (
        <div className="flex w-full flex-col gap-6 px-2 relative">

            {/* Header */}
            <div className="w-full mb-4">
                <h1 className="text-8xl font-extrabold uppercase">Quick Sellers</h1>
                <p className="text-xl font-medium">Connect With India's Largest Wholesale Offers — Fast and Quick</p>
            </div>

            {/* Intelligent Filter Bar */}
            <div className="w-full flex flex-col gap-3 bg-white p-4 border border-black rounded-xl shadow-sm">

                {/* Row 1: Search & Main Filters */}
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex-1 flex items-center bg-gray-50 border border-neutral-200 rounded px-3 focus-within:border-emerald-600 transition-all">
                        <input
                            type="text"
                            placeholder="Search product name or company..."
                            className="w-full py-2.5 outline-none text-sm font-medium bg-transparent"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            className="h-11 px-3 bg-emerald-950 text-white rounded text-[11px] font-bold cursor-pointer outline-none hover:bg-emerald-900 transition-all min-w-[120px]"
                            value={filters.productType}
                            onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
                        >
                            <option value="" className="bg-white text-black">All Categories</option>
                            {productCategories.map(cat => (
                                <option key={cat} value={cat} className="bg-white text-black">{cat}</option>
                            ))}
                        </select>

                        <select
                            className="h-11 px-3 bg-emerald-950 text-white rounded text-[11px] font-bold cursor-pointer outline-none hover:bg-emerald-900 transition-all min-w-[120px]"
                            value={filters.supplyType}
                            onChange={(e) => setFilters({ ...filters, supplyType: e.target.value })}
                        >
                            <option value="" className="bg-white text-black">Supply Type</option>
                            {supplyTypes.map(type => (
                                <option key={type} value={type} className="bg-white text-black">{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 2: Range & Location Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="h-10 px-3 bg-white border border-neutral-300 rounded text-[11px] font-bold text-neutral-600 cursor-pointer outline-none hover:border-emerald-600 transition-all min-w-[110px]"
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        >
                            <option value="">All India</option>
                            {indianCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        <select
                            className="h-10 px-3 bg-white border border-neutral-300 rounded text-[11px] font-bold text-neutral-600 cursor-pointer outline-none hover:border-emerald-600 transition-all min-w-[110px]"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        >
                            <option value="">Price &gt; Min</option>
                            {priceRanges.map(price => (
                                <option key={price} value={price}>₹{price}+</option>
                            ))}
                        </select>

                        <select
                            className="h-10 px-3 bg-white border border-neutral-300 rounded text-[11px] font-bold text-neutral-600 cursor-pointer outline-none hover:border-emerald-600 transition-all min-w-[110px]"
                            value={filters.minUnits}
                            onChange={(e) => setFilters({ ...filters, minUnits: e.target.value })}
                        >
                            <option value="">Units &gt; Min</option>
                            {unitRanges.map(unit => (
                                <option key={unit} value={unit}>{unit}+ PCS</option>
                            ))}
                        </select>

                        {Object.values(filters).some(v => v !== "") && (
                            <button
                                onClick={() => setFilters({ search: "", minPrice: "", minUnits: "", city: "", productType: "", supplyType: "" })}
                                className="h-10 px-4 text-[11px] font-extrabold text-red-600 hover:bg-red-50 rounded transition-all uppercase tracking-tighter"
                            >
                                Reset All
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setIsPopUpOpen(true)}
                        className="h-10 px-5 flex items-center gap-2 text-[11px] font-bold bg-emerald-950 text-white rounded hover:bg-emerald-800 transition shadow-lg ml-auto"
                    >
                        <FaLock className="text-[10px] opacity-70" />
                        <FaStar className="text-yellow-400 text-xs" />
                        Premium Offers
                    </button>
                </div>
            </div>

            {/* Total count */}
            {!loading && !error && (
                <p className="text-sm text-gray-500 font-medium">
                    Showing <span className="text-emerald-700 font-bold">{tickets.length}</span> of <span className="font-bold">{total}</span> wholesale offers
                </p>
            )}

            {/* States */}
            {loading && (
                <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center gap-3 text-gray-400">
                    <svg className="animate-spin w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-sm font-medium">Loading wholesale offers...</span>
                </div>
            )}

            {error && (
                <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
                    <p className="text-red-500 text-sm font-medium">⚠️ {error}</p>
                </div>
            )}

            {!loading && !error && tickets.length === 0 && (
                <div className="w-full h-[calc(100vh-350px)] bg-gray-50 rounded-xl flex justify-center items-center border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm font-medium">No wholesale offers found · Check back later</p>
                </div>
            )}

            {/* Ticket Cards */}
            {!loading && !error && tickets.length > 0 && (
                <div className="w-full flex flex-col gap-4">
                    {tickets.map((ticket) => (
                        <div key={ticket._id} className="w-full bg-white rounded-2xl border-2 border-neutral-300 flex flex-col md:flex-row overflow-hidden hover:border-emerald-600 transition-all duration-300 group">

                            {/* Left — Ticket Info */}
                            <div 
                                className="flex-1 p-6 flex flex-col gap-4 cursor-pointer"
                                onClick={() => setExpandedDealId(prev => prev === ticket._id ? null : ticket._id)}
                            >

                                {/* Header Row */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">{ticket.companyName || 'Verified Seller'}</h3>
                                        <span className="flex items-center gap-1 bg-yellow-400/20 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-yellow-400/30">
                                            <FaStar className="text-[8px]" /> Verified Offer
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-600 uppercase tracking-wide">
                                            {ticket.productType}
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                                            Wholesale
                                        </span>
                                    </div>
                                </div>

                                {/* Price and Quantity */}
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-extrabold text-emerald-950">
                                        ₹{ticket.pricePerProduct}
                                        <span className="text-xs font-normal text-neutral-400 ml-1">/ Unit</span>
                                    </div>
                                    <div className="h-8 w-[1px] bg-neutral-200 mx-2" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-tighter">Available Stock</span>
                                        <span className="text-lg font-bold text-neutral-800">{ticket.units || 0} PCS</span>
                                    </div>
                                </div>

                                {/* Image Carousel (Accordion) */}
                                {ticket.productImages && ticket.productImages.length > 0 && (
                                    <div 
                                        className={`transition-all duration-300 overflow-hidden ${expandedDealId === ticket._id ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="flex items-center gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                                            {ticket.productImages.map((img, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border border-neutral-200 shadow-sm shrink-0 snap-center hover:border-emerald-500 cursor-pointer transition-colors"
                                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                                                >
                                                    <img src={img} alt="Product" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Details Row */}
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-500">
                                    <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                        <span className="text-yellow-600 font-bold uppercase text-[9px] tracking-widest">Product:</span>
                                        <span className="text-neutral-900 font-bold">{ticket.productName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                        <span className="text-yellow-600 font-bold uppercase text-[9px] tracking-widest">City:</span>
                                        <span className="text-neutral-900 font-bold">{ticket.city || ticket.companyLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                        <span className="text-yellow-600 font-bold uppercase text-[9px] tracking-widest">Phone:</span>
                                        <span className="text-neutral-900 font-bold">{ticket.phoneNumber}</span>
                                    </div>
                                    {ticket.email && (
                                        <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                            <span className="text-yellow-600 font-bold uppercase text-[9px] tracking-widest">Email:</span>
                                            <span className="text-neutral-900 font-bold">{ticket.email}</span>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Right — Action Stub */}
                            <div className="w-full md:w-56 bg-emerald-50 border-t md:border-t-0 md:border-l-2 border-dashed border-neutral-300 flex flex-col items-center justify-center p-6 relative gap-4">
                                <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-white rounded-full border-2 border-neutral-300" />
                                <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full border-2 border-neutral-300" />

                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest opacity-60">Ready to Trade?</span>
                                    <span className="text-xs font-bold text-emerald-950 mt-1">Connect with Seller</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/chat/${ticket.userId?._id || ticket.userId}`)}
                                    className="w-full py-4 bg-emerald-950 text-white rounded-xl font-bold text-sm hover:bg-emerald-800 hover:shadow-lg active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    Start Chatting
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2 pb-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${p === page
                                ? 'bg-emerald-950 text-white shadow'
                                : 'border border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-700'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            )}

            {/* Star Sellers Popup */}
            {isPopUpOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-xl flex flex-col gap-4">
                        <h1 className="text-2xl font-bold text-emerald-950">Star Offers</h1>
                        <p className="text-gray-500 text-sm">Upgrade to see premium verified wholesale offers and priority listings.</p>
                        <div className="flex flex-col gap-2 mt-auto">
                            <button className="w-full py-3 font-bold bg-emerald-950 text-white rounded-xl hover:bg-emerald-800 transition">Subscribe</button>
                            <button className="w-full py-3 font-bold border border-emerald-950 text-emerald-950 rounded-xl hover:bg-gray-50 transition" onClick={() => setIsPopUpOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Full View Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-[300] flex justify-center items-center p-4 cursor-pointer backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <img 
                        src={selectedImage} 
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                        alt="Full size view" 
                    />
                    <button 
                        className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl transition"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        ✕
                    </button>
                </div>
            )}

        </div>

    )
}

export default QuickSellers