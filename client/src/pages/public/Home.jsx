import Navbar from "../../components/Navbar";
import QuickTag from "../../components/QuickTags";
import LandingPage from "../../sections/public/LandingPage";

const Home = () => {
    return (
        <div className="w-full min-h-screen text-green-600 pt-16">
            <Navbar/>
            <QuickTag/>
            <LandingPage/>
           
        </div>
    );
};

export default Home;