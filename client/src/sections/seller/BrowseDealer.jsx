import { FaFilter, FaLock, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const BrowseDealer = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [dealers, setDealers] = useState([])
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [isPopUpOpen, setIsPopUpOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedCity, setSelectedCity] = useState("")

    const indianCities = [
        "Agra", "Ahmedabad", "Allahabad", "Amritsar", "Aurangabad", "Bangalore", 
        "Bhopal", "Chandigarh", "Chennai", "Coimbatore", "Delhi", "Dhanbad", 
        "Faridabad", "Ghaziabad", "Guwahati", "Gwalior", "Howrah", "Hyderabad", 
        "Indore", "Jabalpur", "Jaipur", "Jodhpur", "Kanpur", "Kolkata", "Kota", 
        "Lucknow", "Ludhiana", "Madurai", "Meerut", "Mumbai", "Nagpur", "Nashik", 
        "Navi Mumbai", "Patna", "Pune", "Raipur", "Rajkot", "Ranchi", "Solapur", 
        "Srinagar", "Surat", "Thane", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam"
    ];

    const industryCategories = [
        "Clothings & Textiles",
        "Footwear",
        "Electronics & Mobiles",
        "Grocery & Kirana",
        "Hardware & Construction",
        "Automobile Parts",
        "Pharmacy & Healthcare",
        "Furniture & Home Decor",
        "Jewelry",
        "Stationery & Gifts"
    ];


    const handleSubmit = (id) => {
        navigate(`/chat/${id}`)
        console.log(id);
    }
    const navigateRazorPay = (id) => {
        navigate(`/razorpay/${id}`)
    }


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await axios.get(`http://localhost:5000/api/seller/browsedealer`,
                    {
                        params: {
                            page,
                            search: searchTerm,
                            category: selectedCategory,
                            city: selectedCity
                        },
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("Token")}`
                        }
                    }
                );

                setDealers(response.data.dealers);
                setTotalPages(response.data.totalPages || 1)
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setDealers([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [page, searchTerm, selectedCategory, selectedCity])


    return (
        <div className="flex w-full justify-center items-center flex-col gap-4 px-2 relative">
            {/* Header Section */}
            <div className="w-full h-auto ">
                <h1 className="text-8xl font-extrabold uppercase">Browse Dealers</h1>
                <p className="text-xl font-medium"> Search and Chat With the Dealers of your genre</p>
            </div>

            <div className="w-full flex flex-col md:flex-row items-stretch gap-3">
                {/* Search Bar */}
                <div className="flex-1 flex items-center bg-white border-1 border-black rounded-xl px-4 focus-within:border-emerald-600 transition-all ">
                    <input
                        type="text"
                        placeholder="Search by shop name or business type..."
                        className="w-full py-4 outline-none text-sm font-semibold text-neutral-700 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        className="w-full sm:w-44 px-4 py-3 bg-emerald-950 text-white rounded text-sm font-bold cursor-pointer outline-none hover:bg-emerald-900 transition-all shadow-md appearance-none"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="" className="bg-white text-black">All India</option>
                        {indianCities.map(city => (
                            <option key={city} value={city} className="bg-white text-black">{city}</option>
                        ))}
                    </select>

                    <select
                        className="w-full sm:w-44 px-4 py-3 bg-emerald-950 text-white rounded text-sm font-bold cursor-pointer outline-none hover:bg-emerald-900 transition-all shadow-md appearance-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="" className="bg-white text-black">All Categories</option>
                        {industryCategories.map(cat => (
                            <option key={cat} value={cat} className="bg-white text-black">{cat}</option>
                        ))}
                    </select>

                    <button
                        className="w-full sm:w-44 font-bold bg-emerald-950 text-white rounded hover:bg-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-2 py-3 text-sm shadow-md"
                        onClick={() => setIsPopUpOpen(true)}
                    >
                        <FaLock className="text-xs opacity-70" />
                        <FaStar className="text-yellow-400" />
                        <span>Star Dealers</span>
                    </button>
                </div>
            </div>

            <div className="w-full h-auto flex flex-col gap-2">
                {dealers.length == 0 ? (
                    <div className="w-full h-[calc(100vh-350px)] bg-gray-100 flex justify-center items-center ">
                        <h1>No Dealers Found <span className="text-red-500">~ Try Again Later</span></h1>
                    </div>
                ) : (
                    dealers.map((dealer) => (
                        <div key={dealer._id} className="w-full bg-white rounded-xl  border-2 border-neutral-300 flex flex-col md:flex-row overflow-hidden  transition-all duration-300 group">
                            {/* Left Section (The Ticket Info) */}
                            <div className="flex-1 flex-col   flex p-6  gap-3">
                                <div className="w-full gap-3 ">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">{dealer.username}</h3>
                                            {dealer.subscriptionType === 'pro' && (
                                                <span className="flex items-center gap-1 bg-yellow-400/20 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-yellow-400/30">
                                                    <FaStar className="text-[8px]" /> Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {dealer.categories && dealer.categories.length > 0 ? (
                                                dealer.categories.map((cat, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-300 uppercase tracking-wide">
                                                        {cat}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-600 uppercase tracking-wide">
                                                    {dealer.profession}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-light text-gray-400">{dealer.role} X </span>
                                        <span className="font-light text-gray-400">{dealer.profession}</span>

                                    </div>

                                </div>
                                <div>
                                    <p className="text-neutral-600 font-normal mx-2 line-clamp-3">
                                        {dealer.about || "This dealer hasn't provided an introduction yet. Connect to learn more about their offerings and expertise."}
                                    </p>
                                </div>


                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
                                        <span className="font-semibold text-neutral-400">City:</span>
                                        <span className="text-neutral-700 font-medium">{dealer.city}</span>
                                        <span className="text-neutral-300 font-bold mx-2">•</span>

                                        <label htmlFor="" className="font-semibold text-neutral-400">Phone:</label>
                                        <span className="text-neutral-700 font-medium">{dealer.phone}</span>
                                        <span className="text-neutral-300 font-bold mx-2">•</span>

                                        <label htmlFor="" className="font-semibold text-neutral-400">Email:</label>
                                        <span className="text-neutral-700 font-medium">{dealer.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section (The Ticket "Stub" / Action) */}
                            <div className="w-full md:w-48  flex items-end justify-center p-6 relative">
                                <button className="w-full py-3 bg-emerald-950 text-white rounded-xl font-bold hover:bg-emerald-800 hover:scale-105 active:scale-95 transition-all shadow-md"
                                    onClick={() => { handleSubmit(dealer._id) }}
                                >
                                    Connect
                                </button>
                            </div>
                        </div>
                    ))

                )}

            </div>

            {/* ── Pagination ── */}
            <div className="w-full flex items-center justify-center gap-4 py-6">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <FaChevronLeft className="text-xs" />
                </button>

                <span className="text-sm font-semibold text-gray-600">
                    Page <span className="text-emerald-700">{page}</span> of <span className="text-emerald-700">{totalPages}</span>
                </span>

                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <FaChevronRight className="text-xs" />
                </button>
            </div>
            {isPopUpOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="w-1/2 h-1/2 p-8 bg-white rounded-md shadow-xl flex flex-col gap-4">
                        <h1 className="text-2xl font-bold text-emerald-950">Star Dealers</h1>
                        <p className="text-gray-600">Upgrade to view our premium certified dealers and exclusive offers.</p>

                        <div className="flex flex-col gap-2">
                            <button className="w-full py-3 font-bold bg-emerald-950 text-white rounded-md hover:bg-emerald-800 transition-all" onClick={() => {
                                const user = JSON.parse(localStorage.getItem('User'))
                                const id = user?._id || user?.id
                                navigateRazorPay(id)
                            }}>
                                Subscribe
                            </button>
                            <button
                                className="w-full py-3 font-bold border border-emerald-950 text-emerald-950 rounded-md hover:bg-gray-100 transition-all"
                                onClick={() => setIsPopUpOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BrowseDealer