import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUser, FaBuilding, FaCity, FaPhone, FaEnvelope, FaCrown, FaComments, FaSignOutAlt, FaSave } from "react-icons/fa";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        phone: "",
        city: "",
        profession: "",
        subscriptionType: "basic",
        about: "",
        categories: []
    });

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

    const handleCategoryToggle = (category) => {
        setProfileData(prev => {
            const categories = prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
            return { ...prev, categories }
        })
    }
    const [connectedCount, setConnectedCount] = useState(0);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`
                }
            });
            if (response.data.success) {
                setProfileData(response.data.user);
                setConnectedCount(response.data.connectedCount);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        toast.success("Logged out successfully");
        window.location.href = "/login";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await axios.put(
                "http://localhost:5000/api/auth/profile",
                {
                    username: profileData.username,
                    city: profileData.city,
                    profession: profileData.profession,
                    about: profileData.about,
                    categories: profileData.categories
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`
                    }
                }
            );

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                // Update local storage User object so Navbar updates
                const existingUser = JSON.parse(localStorage.getItem("User") || "{}");
                localStorage.setItem("User", JSON.stringify({ ...existingUser, ...response.data.user }));
                setProfileData(response.data.user);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-neutral-200 mt-6">

            {/* Header / Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6 border-neutral-100">
                <div className="w-24 h-24 rounded-full bg-emerald-950 text-white flex items-center justify-center font-bold text-3xl uppercase shadow-md">
                    {profileData.username?.substring(0, 2)}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-emerald-950 capitalize flex items-center justify-center md:justify-start gap-2">
                        {profileData.username}
                        {profileData.subscriptionType === "pro" && (
                            <span className="text-yellow-500 text-xl" title="Premium Pro Account">
                                <FaCrown />
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-500 font-medium capitalize mt-1">Role: {profileData.role}</p>
                    <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${profileData.subscriptionType === 'pro'
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-gray-100 border-gray-200 text-gray-600'
                            }`}>
                            {profileData.subscriptionType} Plan
                        </span>
                        {profileData.subscriptionType === 'basic' && (
                            <button className="text-xs font-semibold text-emerald-700 hover:underline">
                                Upgrade to Pro
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded font-semibold text-sm hover:bg-red-50 transition duration-300"
                >
                    <FaSignOutAlt />
                    Sign Out
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-b border-neutral-100">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase">Total Connections</label>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm" />
                        <input
                            type="text"
                            value={`${connectedCount} People`}
                            disabled
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-neutral-200 rounded-xl text-sm font-bold text-emerald-950 cursor-default"
                        />
                    </div>
                </div>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleSave} className="py-6 flex flex-col gap-5">
                <h3 className="text-lg font-bold text-emerald-950">Update Profile Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase">Username</label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                                required
                            />
                        </div>
                    </div>

                    {/* Profession */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase">Profession / Category</label>
                        <div className="relative">
                            <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                value={profileData.profession}
                                onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                                required
                            />
                        </div>
                    </div>

                    {/* City */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase">City / Location</label>
                        <div className="relative">
                            <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                value={profileData.city}
                                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                                required
                            />
                        </div>
                    </div>

                    {/* About / Introduction */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-600 uppercase">About / Business Introduction</label>
                        <div className="relative">
                            <textarea
                                value={profileData.about}
                                onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                                placeholder="Describe your business, products, or services..."
                                className="w-full px-4 py-3 bg-gray-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition min-h-[100px] resize-none"
                            />
                        </div>
                    </div>

                    {/* Categories Selection */}
                    <div className="flex flex-col gap-3 md:col-span-2 mt-2">
                        <label className="text-xs font-bold text-gray-600 uppercase">Business Categories</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {industryCategories.map(cat => (
                                <div
                                    key={cat}
                                    onClick={() => handleCategoryToggle(cat)}
                                    className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-medium transition-all text-center ${profileData.categories?.includes(cat)
                                            ? "bg-emerald-950 text-white border-emerald-950"
                                            : "bg-gray-50 text-gray-500 border-neutral-200 hover:border-emerald-600"
                                        }`}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-emerald-950 mt-4">Security & Contact (Non-Editable)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="flex flex-col gap-1.5 opacity-65">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="email"
                                value={profileData.email}
                                disabled
                                className="w-full pl-10 pr-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5 opacity-65">
                        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                value={profileData.phone}
                                disabled
                                className="w-full pl-10 pr-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-950 text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition duration-300 shadow-md disabled:opacity-50"
                    >
                        <FaSave />
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
