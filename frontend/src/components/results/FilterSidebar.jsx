import { useState } from "react";
import {
    SlidersHorizontal,
    ChevronDown,
    ChevronUp,
    IndianRupee,
    Store,
    Star,
    Package,
    Sparkles
} from "lucide-react";

import "./FilterSidebar.css";

const FilterSidebar = () => {

    const [openSections, setOpenSections] = useState({
        price: true,
        stores: true,
        rating: true,
        availability: true,
        ai: true,
    });

    const [price, setPrice] = useState(50000);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    

    const [selectedAI, setSelectedAI] = useState([]);
    const toggleAI = (tag) => {
    setSelectedAI(prev =>
        prev.includes(tag)
            ? prev.filter(item => item !== tag)
            : [...prev, tag]
    );
    };

    return (

        <aside className="filter-sidebar">

            {/* Header */}

            <div className="filter-header">

                <SlidersHorizontal size={22} />

                <div>

                    <h2>Filters</h2>

                    <p>Refine your search</p>

                </div>

            </div>


            {/* PRICE */}

            <div className="filter-card">

                <button
                    className="filter-title"
                    onClick={() => toggleSection("price")}
                >

                    <div>

                        <IndianRupee size={18} />

                        <span>Price</span>

                    </div>

                    {openSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

                </button>

                {openSections.price && (

                    <div className="filter-content">

                        <input
    type="range"
    min="0"
    max="100000"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
/>

<div className="selected-price-box">

    <span className="selected-label">
        Current Price
    </span>

    <span className="selected-price">
        ₹{Number(price).toLocaleString()}
    </span>

</div>

<div className="price-values">

    <span>₹0</span>

    <span>₹100000</span>

</div>

                    </div>

                )}

            </div>


            {/* STORES */}

            <div className="filter-card">

                <button
                    className="filter-title"
                    onClick={() => toggleSection("stores")}
                >

                    <div>

                        <Store size={18} />

                        <span>Stores</span>

                    </div>

                    {openSections.stores ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

                </button>

                {openSections.stores && (

                    <div className="filter-content checkbox-list">

                        <label>
                            <input type="checkbox" />
                            <span>Amazon</span>
                        </label>

                        <label>
                            <input type="checkbox" />
                            <span>Flipkart</span>
                        </label>

                        <label>
                            <input type="checkbox" />
                            <span>Croma</span>
                        </label>

                        <label>
                            <input type="checkbox" />
                            <span>Reliance Digital</span>
                        </label>

                    </div>

                )}

            </div>


            {/* RATING */}

            <div className="filter-card">

                <button
                    className="filter-title"
                    onClick={() => toggleSection("rating")}
                >

                    <div>

                        <Star size={18} />

                        <span>Rating</span>

                    </div>

                    {openSections.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

                </button>

                {openSections.rating && (

                    <div className="filter-content checkbox-list">

                        <label>

                            <input type="radio" name="rating" />

                            <span>4★ & Above</span>

                        </label>

                        <label>

                            <input type="radio" name="rating" />

                            <span>3★ & Above</span>

                        </label>

                    </div>

                )}

            </div>


            {/* AVAILABILITY */}

            <div className="filter-card">

                <button
                    className="filter-title"
                    onClick={() => toggleSection("availability")}
                >

                    <div>

                        <Package size={18} />

                        <span>Availability</span>

                    </div>

                    {openSections.availability ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

                </button>

                {openSections.availability && (

                    <div className="filter-content checkbox-list">

                        <label>

                            <input type="checkbox" />

                            <span>In Stock</span>

                        </label>

                        <label>

                            <input type="checkbox" />

                            <span>Out of Stock</span>

                        </label>

                    </div>

                )}

            </div>


            {/* AI FILTERS */}

            <div className="filter-card">

                <button
                    className="filter-title"
                    onClick={() => toggleSection("ai")}
                >

                    <div>

                        <Sparkles size={18} />

                        <span>AI Filters</span>

                    </div>

                    {openSections.ai ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

                </button>

                {openSections.ai && (

                    <div className="ai-tags">

                        <button
    className={selectedAI.includes("Budget Friendly") ? "active" : ""}
    onClick={() => toggleAI("Budget Friendly")}
>
    Budget Friendly
</button>

                        <button
    className={selectedAI.includes("Best Value") ? "active" : ""}
    onClick={() => toggleAI("Best Value")}
>
    Best Value
</button>

                        <button
    className={selectedAI.includes("Lowest Today") ? "active" : ""}
    onClick={() => toggleAI("Lowest Today")}
>
    Lowest Today
</button>

                        <button
    className={selectedAI.includes("AI Pick") ? "active" : ""}
    onClick={() => toggleAI("AI Pick")}
>
    AI Pick
</button>

                    </div>

                )}

            </div>

            <button className="reset-btn">

                Reset Filters

            </button>

        </aside>

    );

};

export default FilterSidebar;