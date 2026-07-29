import Navbar from "../components/common/Navbar/Navbar.jsx";
import Hero from "../components/home/Hero/Hero.jsx";
import TrendingSearches from "../components/home/TrendingSearches/TrendingSearches.jsx";
import Features from "../components/home/Features/Features.jsx";
import Footer from "../components/common/Footer/Footer.jsx";

const Home = () => {
    return (
        <>
            <Navbar/>

            <main>
                <Hero />
                <TrendingSearches />
                <Features />
            </main>

            <Footer />
        </>
    );
};

export default Home;
