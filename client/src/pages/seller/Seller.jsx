import Navbar from "../../components/seller/Navbar"
import Sidebar from "../../components/seller/Sidebar"
import { useLocation } from "react-router-dom"
import BrowseDealer from "../../sections/seller/BrowseDealer"
import QuickDeals from "../../sections/seller/QuickDeals"
import CreateTicket from "../../sections/seller/CreateTicket"
import RecentChat from "../../sections/seller/RecentChat"
import FinancialDashboard from "../../sections/seller/FinancialDashboard"
import Profile from "../../sections/shared/Profile"
import { useState } from "react";

const Seller = () => {
    const { pathname } = useLocation()
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isBrowseDealer = pathname.includes("/browsedealer")
    const isQuickDeals = pathname.includes("/quickdeals")
    const isCreateTicket = pathname.includes("/createticket")
    const isRecentChat = pathname.includes("/recentchat")
    const isFinancialDashboard = pathname.includes("/financialdashboard")
    const isProfile = pathname.includes("/profile")

    return (
        <div className="w-full min-h-screen text-black flex">
           
            <div className={`${isCollapsed ? "w-20" : "w-64"} h-full fixed top-0 left-0 z-40 shadow-2xl shadow-emerald-500/5 transition-all duration-300 ease-in-out`}>
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>

            
            <div className={`flex-1 ${isCollapsed ? "ml-20" : "ml-64"} flex flex-col transition-all duration-300 ease-in-out`}>
                <div className="sticky top-0 z-100 w-full">
                    <Navbar />
                </div>

                <div className="p-8 flex-1 w-full overflow-y-auto">
                    {!isBrowseDealer && !isQuickDeals && !isCreateTicket && !isRecentChat && !isFinancialDashboard && !isProfile && <BrowseDealer />}
                    {isBrowseDealer && <BrowseDealer />}
                    {isQuickDeals && <QuickDeals />}
                    {isCreateTicket && <CreateTicket />}
                    {isRecentChat && <RecentChat />}
                    {isFinancialDashboard && <FinancialDashboard />}
                    {isProfile && <Profile />}

                    
                </div>
            </div>
        </div>
    );
};

export default Seller;
