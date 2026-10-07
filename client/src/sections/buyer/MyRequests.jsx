import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaSpinner } from 'react-icons/fa';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteRequestId, setDeleteRequestId] = useState(null);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('Token');
            const res = await axios.get('http://localhost:5000/api/buyer/myrequests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data.tickets || []);
        } catch (error) {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const confirmDelete = async () => {
        if (!deleteRequestId) return;
        try {
            const token = localStorage.getItem('Token');
            await axios.delete(`http://localhost:5000/api/buyer/request/${deleteRequestId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Request deleted successfully");
            setRequests(requests.filter(r => r._id !== deleteRequestId));
        } catch (error) {
            toast.error("Failed to delete request");
        } finally {
            setDeleteRequestId(null);
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 px-2">
            <div className="w-full sticky top-0 z-50">
                <h1 className="text-8xl font-extrabold uppercase">My Requests</h1>
                <p className="text-xl font-medium">Manage all the product requests you have posted</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-emerald-700">
                    <FaSpinner className="animate-spin text-4xl" />
                </div>
            ) : requests.length === 0 ? (
                <div className="w-full py-20 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center">
                    <p className="text-neutral-500 font-medium text-lg">You haven't posted any requests yet.</p>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-4">
                    {requests.map((req) => (
                        <div key={req._id} className="w-full bg-white rounded-2xl border-2 border-neutral-300 flex flex-col md:flex-row overflow-hidden hover:border-emerald-600 transition-all duration-300 group relative">

                            {/* Left — Request Info */}
                            <div className="flex-1 p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <h3 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">{req.productName}</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-600 uppercase tracking-wide">
                                            Product Type : {req.productType}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-tighter">Price Per Unit</span>
                                        <div className="text-3xl font-extrabold text-emerald-950">₹{req.pricePerProduct}</div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-neutral-200 mx-2" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-tighter">Needed Units</span>
                                        <span className="text-lg font-bold text-neutral-800">{req.units || 0} PCS</span>
                                    </div>
                                </div>

                                {req.productImages && req.productImages.length > 0 && (
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                                        {req.productImages.map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-neutral-200 shadow-sm shrink-0 snap-center hover:border-emerald-500 cursor-pointer transition-colors">
                                                <img src={img} alt="Product" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-500 mt-auto pt-2">
                                    <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                        <span className="text-yellow-600 font-bold uppercase text-[9px] tracking-widest">Posted on:</span>
                                        <span className="text-neutral-900 font-bold">{new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setDeleteRequestId(req._id)}
                                className="absolute top-4 right-4 w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                title="Delete Request"
                            >
                                <FaTrash className="text-sm" />
                            </button>

                        </div>
                    ))}
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteRequestId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mb-2">
                            <FaTrash />
                        </div>
                        <h2 className="text-2xl font-extrabold text-neutral-900">Delete Request?</h2>
                        <p className="text-sm font-medium text-neutral-500">
                            Are you absolutely sure you want to delete this request? This action cannot be undone.
                        </p>
                        <div className="flex w-full gap-3 mt-4">
                            <button 
                                onClick={() => setDeleteRequestId(null)}
                                className="flex-1 py-3 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRequests;
