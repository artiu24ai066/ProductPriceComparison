import Navbar from "../components/common/Navbar/Navbar.jsx";
import Footer from "../components/common/Footer/Footer.jsx";
import SearchHeader from "../components/results/SearchHeader.jsx";
import FilterSidebar from "../components/results/FilterSidebar.jsx";
import ProductGrid from "../components/results/ProductGrid/ProductGrid.jsx"
import StoreComparison from "../components/results/StoreComparison/StoreComparison.jsx"
import AIRecommendation from "../components/results/AIRecommendation/AIRecommendation.jsx"
import RelatedProducts from "../components/results/RelatedProducts/RelatedProducts.jsx"
import RecentlyViewed from "../components/results/RecentlyViewed/RecentlyViewed.jsx"
import PriceHistory from "../components/results/PriceHistory/PriceHistory.jsx"

import "../styles/results.css";

const SearchResults = () => {
    return (
        <>
            <Navbar />

            <main className="results-page">

                <SearchHeader />

                <div className="results-layout">

                    <FilterSidebar />

                    <ProductGrid />

                </div>

                <StoreComparison />

                <PriceHistory />
                <AIRecommendation />

                <RelatedProducts />

                <RecentlyViewed />

            </main>

            <Footer />

        </>

    );
};

export default SearchResults;