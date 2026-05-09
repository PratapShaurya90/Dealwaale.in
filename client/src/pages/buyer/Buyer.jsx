import Sidebar from "../../components/buyer/Sidebar"
import { useLocation } from "react-router-dom"
import BrowseSellers from "../../sections/buyer/BrowseSellers"
import CreateRequest from "../../sections/buyer/CreateRequest"
import RecentChat from "../../sections/buyer/RecentChat"
import FinancialOverview from "../../sections/buyer/FinancialOverview"
import QuickSellers from "../../sections/buyer/QuickSellers"
import Navbar from "../../components/buyer/Navbar"
import Profile from "../../sections/shared/Profile"

const Buyer = () => {
    const { pathname } = useLocation()

    const isBrowseSellers = pathname.includes("/browsesellers")
    const isQuickSellers = pathname.includes("/quicksellers")
    const isCreateRequest = pathname.includes("/createticket")
    const isRecentChat = pathname.includes("/recentchat")
    const isFinancialOverview = pathname.includes("/financialoverview")
    const isProfile = pathname.includes("/profile")

    return (
        <div className="w-full min-h-screen text-black flex">
            {/* Sidebar Container */}
            <div className="w-64 h-full fixed top-0 left-0 z-40 shadow-2xl shadow-emerald-500/5">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col">
                <div className="sticky top-0 z-50 w-full">
                    <Navbar />
                </div>
                
                <div className="p-8 flex-1 w-full overflow-y-auto">
                    {isBrowseSellers && <BrowseSellers />}
                    {isQuickSellers && <QuickSellers />}
                    {isCreateRequest && <CreateRequest />}
                    {isRecentChat && <RecentChat />}
                    {isFinancialOverview && <FinancialOverview />}
                    {isProfile && <Profile />}
                    
                    {!isBrowseSellers && !isCreateRequest && !isQuickSellers && !isRecentChat && !isFinancialOverview && !isProfile && (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 py-20">
                            <h2 className="text-xl font-semibold mb-2 text-white">Select a section</h2>
                            <p>Use the sidebar to navigate through your buyer dashboard.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Buyer