import "./ProductGrid.css";
import { useState, useRef, useEffect } from "react";
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

                {!loading && products.map((product) => {
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