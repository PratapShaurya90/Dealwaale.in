import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaHome, FaBox, FaTicketAlt, FaComments, FaChartLine } from "react-icons/fa";

const Sidebar = () => {
    return (
        <div className="w-full h-screen flex flex-col gap-4 justify-between bg-emerald-950">
            {/* Back Button Section */}
            <div className=" pt-4">
                <div className="w-full h-auto p-6">
                    <Link to="/" className="group flex items-center justify-start gap-2 text-white hover:text-white transition-all duration-300 w-max">
                        <IoIosArrowRoundBack size={40} className="transition-transform duration-300 group-hover:-translate-x-2 group-hover:text-white" />
                        <span className="font-semibold text-lg">Back</span>
                    </Link>
                </div>

                {/* Image Here */}
                <div className="w-full px-4">
                    <div className="text-center">

                    </div>
                </div>


                <div className="w-full h-auto flex flex-col justify-center px-4 py-2 gap-3">
                    <Link to="/buyer/browsesellers" className="group flex items-center gap-4 text-white hover:text-black transition-all duration-300 p-3 hover:bg-slate-100">
                        <FaHome size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:white" />
                        <span className="font-semibold text-md">Browse Sellers</span>
                    </Link>

                    <Link to="/buyer/quicksellers" className="group flex items-center gap-4 text-white hover:text-black transition-all duration-300 p-3 hover:bg-slate-100 ">
                        <FaBox size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:white" />
                        <span className="font-semibold text-md">Quick Sellers</span>
                    </Link>

                    <Link to="/buyer/createticket" className="group flex items-center gap-4 text-white hover:text-black transition-all duration-300 p-3 hover:bg-slate-100 ">
                        <FaTicketAlt size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:white" />
                        <span className="font-semibold text-md">Create Request</span>
                    </Link>

                    <Link to="/buyer/recentchat" className="group flex items-center gap-4 text-white hover:text-black transition-all duration-300 p-3 hover:bg-slate-100 ">
                        <FaComments size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:white" />
                        <span className="font-semibold text-md">Recent Chat</span>
                    </Link>
                </div>
            </div>


            <div className="w-full h-auto flex flex-col justify-center px-4 py-2 gap-3  pt-4">
                <Link to="/buyer/financialoverview" className="group flex items-center gap-4 text-white hover:text-black transition-all duration-300 p-3 hover:bg-slate-100 ">
                    <FaChartLine size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:white" />
                    <span className="font-semibold text-md">Financial Overview</span>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;
