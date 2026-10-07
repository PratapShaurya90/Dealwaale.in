import Sidebar from "../../components/buyer/Sidebar"
import { useLocation } from "react-router-dom"
import BrowseSellers from "../../sections/buyer/BrowseSellers"
import CreateRequest from "../../sections/buyer/CreateRequest"
import RecentChat from "../../sections/buyer/RecentChat"
import FinancialOverview from "../../sections/buyer/FinancialOverview"
import QuickSellers from "../../sections/buyer/QuickSellers"
import Navbar from "../../components/buyer/Navbar"
import Profile from "../../sections/shared/Profile"
import MyRequests from "../../sections/buyer/MyRequests"
import { useState } from "react"

const Buyer = () => {
    const { pathname } = useLocation()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const isBrowseSellers = pathname.includes("/browsesellers")
    const isQuickSellers = pathname.includes("/quicksellers")
    const isCreateRequest = pathname.includes("/createticket")
    const isBuyer = pathname.includes('/buyer')
    const isRecentChat = pathname.includes("/recentchat")
    const isFinancialOverview = pathname.includes("/financialoverview")
    const isProfile = pathname.includes("/profile")
    const isMyRequests = pathname.includes("/myrequests")

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden text-black">
            {/* Sidebar Container */}
            <div className={`transition-all duration-300 ease-in-out z-20 shadow-xl ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
                <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "w-[calc(100%-5rem)]" : "w-[calc(100%-16rem)]"}`}>
                <div className="sticky top-0 z-50 w-full shadow-sm">
                    <Navbar />
                </div>
                
                <div className="p-8 flex-1 w-full overflow-y-auto">
                   
                    {isBrowseSellers && <BrowseSellers />}
                    {isQuickSellers && <QuickSellers />}
                    {isCreateRequest && <CreateRequest />}
                    {isRecentChat && <RecentChat />}
                    {isFinancialOverview && <FinancialOverview />}
                    {isProfile && <Profile />}
                    {isMyRequests && <MyRequests />}
                    
                    {!isBrowseSellers && !isCreateRequest && !isQuickSellers && !isRecentChat && !isFinancialOverview && !isProfile && !isMyRequests && (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 py-20">
                            <h2 className="text-xl font-semibold mb-2 text-black">Select a section</h2>
                            <p>Use the sidebar to navigate through your buyer dashboard.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Buyer