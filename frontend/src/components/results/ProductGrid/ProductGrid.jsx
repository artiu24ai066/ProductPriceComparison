import "./ProductGrid.css";
import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import ProductCard from "../ProductCard/ProductCard.jsx";

const ProductGrid = ({ products = [], loading = false, comparedProducts = [], onCompare = () => {} }) => {
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("No Sorting");
    const sortRef = useRef(null);

    const options = [
        "No Sorting",
        "AI Recommended",
        "Lowest Price",
        "Highest Rating",
        "Newest",
        "Most Popular",
    ];

    useEffect(() => {

    const handleClickOutside = (event) => {

        if (
            sortRef.current &&
            !sortRef.current.contains(event.target)
        ) {
            setSortOpen(false);
        }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
    };

}, []);

    const sortedProducts = useMemo(() => {
        const list = [...products];

        switch (selectedSort) {
            case "Lowest Price":
                return list.sort((a, b) => (a?.priceStats?.lowest ?? Infinity) - (b?.priceStats?.lowest ?? Infinity));
            case "Highest Rating":
                return list.sort((a, b) => (b?.overallRating ?? b?.sellers?.[0]?.rating ?? 0) - (a?.overallRating ?? a?.sellers?.[0]?.rating ?? 0));
            case "Newest":
                return list.sort((a, b) => {
                    const aDate = new Date(a?.lastUpdated || a?.sellers?.[0]?.scrapedAt || a?.createdAt || 0).getTime();
                    const bDate = new Date(b?.lastUpdated || b?.sellers?.[0]?.scrapedAt || b?.createdAt || 0).getTime();
                    return bDate - aDate;
                });
            case "Most Popular":
            case "AI Recommended":
                return list.sort((a, b) => (b?.matching?.confidence ?? 0) - (a?.matching?.confidence ?? 0));
            default:
                return list;
        }
    }, [products, selectedSort]);

    return (

        <section className="product-grid-section">

            {/* Top */}

            <div className="grid-header">

                <div>

                    <h2>Search Results</h2>

                    <p>
                        Showing <span>{products.length}</span> matching products
                    </p>

                </div>

                <div className="sort-box" ref={sortRef}>

    <button
        className="sort-btn"
        onClick={() => setSortOpen(!sortOpen)}
    >

        <div>

            <ArrowUpDown size={17} />

            {selectedSort}

        </div>

        <ChevronDown
            size={18}
            className={sortOpen ? "rotate" : ""}
        />

    </button>

    {sortOpen && (

        <div className="sort-menu">

            {options.map((option) => (

                <button

                    key={option}

                    className={selectedSort === option ? "active" : ""}

                    onClick={() => {

                        setSelectedSort(option);

                        setSortOpen(false);

                    }}

                >

                    {option}

                </button>

            ))}

        </div>

    )}

</div>

            </div>

            {/* Grid */}

            <div className="product-grid">
                {loading && (
                    <div className="loading-placeholder">
                        Fetching live prices, please wait...
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="no-results">
                        No products found for this search query.
                    </div>
                )}

                {!loading && sortedProducts.map((product) => {
                    const productKey = product.groupId || product.canonicalTitle || product?.sellers?.[0]?.url;
                    const isCompared = comparedProducts.some((item) =>
                        (item?.groupId || item?.canonicalTitle || item?.sellers?.[0]?.url) === productKey
                    );
                    return (
                        <ProductCard
                            key={productKey || Math.random()}
                            product={product}
                            onCompare={onCompare}
                            isCompared={isCompared}
                        />
                    );
                })}
            </div>

        </section>

    );

};

export default ProductGrid;