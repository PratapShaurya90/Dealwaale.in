import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaHome, FaBox, FaTicketAlt, FaComments, FaChartLine, FaBars } from "react-icons/fa";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    return (
        <div className={`h-screen flex flex-col gap-4 justify-between bg-emerald-950 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-full"}`}>

            <div className=" pt-4">
                <div className={`w-full h-auto p-4 flex items-center ${isCollapsed ? "flex-col-reverse gap-6" : "justify-between p-6"}`}>
                    <Link to="/" className="group flex items-center justify-start gap-2 text-white hover:text-emerald-400 transition-all duration-300 w-max">
                        <IoIosArrowRoundBack size={isCollapsed ? 30 : 40} className="transition-transform duration-300 group-hover:-translate-x-2" />
                        {!isCollapsed && <span className="font-semibold text-lg overflow-hidden whitespace-nowrap transition-all duration-300">Back</span>}
                    </Link>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-10 h-10 rounded-xl bg-emerald-900/50 flex items-center justify-center text-white hover:bg-emerald-800 transition-all duration-300 shadow-lg border border-emerald-800/50"
                    >
                        <FaBars size={18} className={`transition-transform duration-500 ${isCollapsed ? "rotate-90" : ""}`} />
                    </button>
                </div>


                <div className="w-full px-4">
                    <div className="text-center">

                    </div>
                </div>


                <div className="w-full h-auto flex flex-col justify-center px-3 py-2 gap-2">
                    {[
                        { to: "/seller/browsedealer", icon: FaHome, label: "Browse Dealers" },
                        { to: "/seller/quickdeals", icon: FaBox, label: "Quick Dealers" },
                        { to: "/seller/createticket", icon: FaTicketAlt, label: "Create Ticket" },
                        { to: "/seller/recentchat", icon: FaComments, label: "Recent Chat" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`group flex items-center ${isCollapsed ? "justify-center" : "gap-4"} text-white hover:text-emerald-950 transition-all duration-300 p-3 rounded-xl hover:bg-emerald-50`}
                        >
                            <item.icon size={22} className="transition-transform duration-300 group-hover:scale-110 shrink-0" />
                            {!isCollapsed && <span className="font-medium text-md whitespace-nowrap overflow-hidden transition-all duration-300">{item.label}</span>}
                        </Link>
                    ))}
                </div>
            </div>


            <div className="w-full h-auto flex flex-col justify-center px-3 py-4 gap-2 border-t border-emerald-900">
                <Link to="/seller/financialdashboard" className={`group flex items-center ${isCollapsed ? "justify-center" : "gap-4"} text-white hover:text-emerald-950 transition-all duration-300 p-3 rounded-xl hover:bg-emerald-50`}>
                    <FaChartLine size={22} className="transition-transform duration-300 group-hover:scale-110 shrink-0" />
                    {!isCollapsed && <span className="font-medium text-md whitespace-nowrap overflow-hidden transition-all duration-300">Financial Dashboard</span>}
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;