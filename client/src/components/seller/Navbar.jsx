import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [displayName, setDisplayName] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        setDisplayName(user?.username || "Seller");
    }, [])

    return (
        <div className="w-full h-auto bg-white/50 flex items-center justify-between px-6 backdrop-blur-md py-4 border-b-4 border-zinc-200">
            <div className="flex items-center gap-4">
                <p className="text-md italic">" Every Great Individual is the by-product of the network they created "</p>
            </div>
            <Link to="/seller/profile" className="flex items-center gap-4 hover:opacity-80 transition duration-200 cursor-pointer">
                <div className="rounded-lg w-10 h-10 bg-emerald-950 text-white font-bold flex items-center justify-center uppercase text-sm">
                    {displayName?.substring(0, 2)}
                </div>
                <span className="font-semibold text-sm text-emerald-950">Hello, {displayName}</span>
            </Link>
        </div>
    )
}

export default Navbar