import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/axios";

import Navbar from "../components/common/Navbar/Navbar.jsx";
import Footer from "../components/common/Footer/Footer.jsx";
import SearchHeader from "../components/results/SearchHeader.jsx";
import FilterSidebar from "../components/results/FilterSidebar.jsx";
import ProductGrid from "../components/results/ProductGrid/ProductGrid.jsx";
import StoreComparison from "../components/results/StoreComparison/StoreComparison.jsx";
import AIRecommendation from "../components/results/AIRecommendation/AIRecommendation.jsx";
import RelatedProducts from "../components/results/RelatedProducts/RelatedProducts.jsx";
import RecentlyViewed from "../components/results/RecentlyViewed/RecentlyViewed.jsx";
import PriceHistory from "../components/results/PriceHistory/PriceHistory.jsx";

import "../styles/results.css";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState([]);
    const [totalStores, setTotalStores] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comparedProducts, setComparedProducts] = useState([]);
    const [filters, setFilters] = useState({
        price: 100000,
        stores: [],
        rating: 0,
        availability: {
            inStock: false,
            outOfStock: false,
        },
        ai: [],
    });

    const handleCompareToggle = (product) => {
        const productKey = product?.groupId || product?.canonicalTitle || product?.sellers?.[0]?.url;
        setComparedProducts((prev) => {
            const exists = prev.some((item) =>
                (item?.groupId || item?.canonicalTitle || item?.sellers?.[0]?.url) === productKey
            );
            if (exists) {
                return prev.filter((item) =>
                    (item?.groupId || item?.canonicalTitle || item?.sellers?.[0]?.url) !== productKey
                );
            }
            return [...prev, product];
        });
    };

    const handleClearComparison = () => {
        setComparedProducts([]);
    };

    useEffect(() => {
        if (!query) return;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    "/products/search-results",
                    {
                        params: {
                            q: query,
                        },
                    }
                );

                const data = response.data.data || {};
                setProducts(data.products || []);
                setTotalStores(data.totalStores || 0);
                setLastUpdated(data.lastUpdated || null);
                setFilters((prev) => ({
                    ...prev,
                    price: data.products?.reduce((currentMax, product) => {
                        const price = product?.priceStats?.lowest ?? 0;
                        return Math.max(currentMax, price);
                    }, 100000) || 100000,
                }));
            } catch (error) {
                console.log(error);
                setProducts([]);
                setTotalStores(0);
                setLastUpdated(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const lowestPrice = product?.priceStats?.lowest ?? null;
            const overallRating = product?.overallRating ?? product?.sellers?.[0]?.rating ?? 0;
            const productAvailability = (product?.availability || "").toLowerCase();
            const sellers = product?.sellers || [];

            if (filters.price && lowestPrice != null && lowestPrice > filters.price) {
                return false;
            }

            if (filters.stores.length > 0) {
                const hasStore = sellers.some((seller) =>
                    filters.stores.includes((seller.website || seller.sellerName || "").toLowerCase())
                );
                if (!hasStore) {
                    return false;
                }
            }

            if (filters.rating && overallRating < filters.rating) {
                return false;
            }

            if (filters.availability.inStock || filters.availability.outOfStock) {
                const inStock = productAvailability.includes("in stock") || sellers.some((seller) =>
                    (seller.availability || "").toLowerCase().includes("in stock")
                );
                const outOfStock = !inStock;
                if (filters.availability.inStock && !inStock) return false;
                if (filters.availability.outOfStock && !outOfStock) return false;
            }

            if (filters.ai.length > 0) {
                const productScore = product?.matching?.confidence || 0;
                const price = lowestPrice ?? Number.MAX_SAFE_INTEGER;
                const average = product?.priceStats?.average ?? 0;
                const tagMatches = filters.ai.every((tag) => {
                    if (tag === "Budget Friendly") {
                        return price <= 25000;
                    }
                    if (tag === "Best Value") {
                        return average > 0 && overallRating >= 4;
                    }
                    if (tag === "Lowest Today") {
                        return price <= 20000;
                    }
                    if (tag === "AI Pick") {
                        return productScore >= 80;
                    }
                    return true;
                });
                if (!tagMatches) return false;
            }

            return true;
        });
    }, [products, filters]);

    return (
        <>
            <Navbar />

            <main className="results-page">

                <SearchHeader
                    query={query}
                    totalProducts={products.length}
                    totalStores={totalStores}
                    lastUpdated={lastUpdated}
                />

                <div className="results-layout">

                    <FilterSidebar
                        filters={filters}
                        onPriceChange={(value) => setFilters((prev) => ({ ...prev, price: value }))}
                        onStoreToggle={(store) =>
                            setFilters((prev) => {
                                const storeValue = store.toLowerCase();
                                const stores = prev.stores.includes(storeValue)
                                    ? prev.stores.filter((item) => item !== storeValue)
                                    : [...prev.stores, storeValue];
                                return { ...prev, stores };
                            })
                        }
                        onRatingChange={(rating) => setFilters((prev) => ({ ...prev, rating }))}
                        onAvailabilityChange={(availability) =>
                            setFilters((prev) => ({ ...prev, availability }))
                        }
                        onAIToggle={(tag) =>
                            setFilters((prev) => {
                                const selected = prev.ai.includes(tag)
                                    ? prev.ai.filter((item) => item !== tag)
                                    : [...prev.ai, tag];
                                return { ...prev, ai: selected };
                            })
                        }
                        onReset={() =>
                            setFilters({
                                price: 100000,
                                stores: [],
                                rating: 0,
                                availability: { inStock: false, outOfStock: false },
                                ai: [],
                            })
                        }
                    />

                    <ProductGrid
                        products={filteredProducts}
                        loading={loading}
                        comparedProducts={comparedProducts}
                        onCompare={handleCompareToggle}
                    />

                </div>

                <StoreComparison product={comparedProducts[0] || filteredProducts[0] || products[0]} />

                <PriceHistory products={comparedProducts} onReset={handleClearComparison} />
                <AIRecommendation />

                <RelatedProducts />

                <RecentlyViewed />

            </main>

            <Footer />

        </>

    );
};

export default SearchResults;