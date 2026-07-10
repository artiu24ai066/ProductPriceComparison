import "./ProductGrid.css";
import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import ProductCard from "../ProductCard/ProductCard.jsx";

const products = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
}));

const ProductGrid = () => {
    const [sortOpen, setSortOpen] = useState(false);

    const [selectedSort, setSelectedSort] = useState("No Sorting");

    const sortRef = useRef(null);

    const options = [
        "No Sorting",
        "AI Recommended",
        "Lowest Price",
        "Highest Rating",
        "Newest",
        "Most Popular"
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

                {products.map((product) => (

                    <ProductCard key={product.id} />

                ))}

            </div>

        </section>

    );

};

export default ProductGrid;