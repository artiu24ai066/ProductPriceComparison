import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/axios";

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
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    "/products/search-results", {
                        params: {
                            q: query
                        }
                    }
                );
                setProducts(response.data.data?.products || []);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, [query]);

    return (
        <>
            <Navbar />

            <main className="results-page">

                <SearchHeader query={query} totalProducts={products.length} />

                <div className="results-layout">

                    <FilterSidebar />

                    <ProductGrid products={products} loading={loading} />

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