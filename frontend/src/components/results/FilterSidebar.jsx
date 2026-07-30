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

const FilterSidebar = ({
    filters,
    onPriceChange = () => {},
    onStoreToggle = () => {},
    onRatingChange = () => {},
    onAvailabilityChange = () => {},
    onAIToggle = () => {},
    onReset = () => {},
}) => {

    const [openSections, setOpenSections] = useState({
        price: true,
        stores: true,
        rating: true,
        availability: true,
        ai: true,
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const selectedAI = filters?.ai || [];
    const selectedStores = filters?.stores || [];
    const selectedRating = filters?.rating || 0;
    const availability = filters?.availability || { inStock: false, outOfStock: false };

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
                            value={filters.price}
                            onChange={(e) => onPriceChange(Number(e.target.value))}
                        />

                        <div className="selected-price-box">
                            <span className="selected-label">Current Price</span>
                            <span className="selected-price">
                                ₹{Number(filters.price).toLocaleString()}
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

                        {[
                            "Amazon",
                            "Flipkart",
                            "Croma",
                            "Reliance Digital",
                        ].map((store) => {
                            const storeKey = store.toLowerCase();
                            return (
                                <label key={storeKey}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStores.includes(storeKey)}
                                        onChange={() => onStoreToggle(store)}
                                    />
                                    <span>{store}</span>
                                </label>
                            );
                        })}

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

                        {[4, 3].map((star) => (
                            <label key={`rating-${star}`}>
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={selectedRating === star}
                                    onChange={() => onRatingChange(star)}
                                />
                                <span>{star}★ & Above</span>
                            </label>
                        ))}

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
                            <input
                                type="checkbox"
                                checked={availability.inStock}
                                onChange={() =>
                                    onAvailabilityChange({
                                        ...availability,
                                        inStock: !availability.inStock,
                                    })
                                }
                            />
                            <span>In Stock</span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={availability.outOfStock}
                                onChange={() =>
                                    onAvailabilityChange({
                                        ...availability,
                                        outOfStock: !availability.outOfStock,
                                    })
                                }
                            />
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
                        {[
                            "Budget Friendly",
                            "Best Value",
                            "Lowest Today",
                            "AI Pick",
                        ].map((tag) => (
                            <button
                                key={tag}
                                className={selectedAI.includes(tag) ? "active" : ""}
                                onClick={() => onAIToggle(tag)}
                                type="button"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                )}

            </div>

            <button className="reset-btn" type="button" onClick={onReset}>
                Reset Filters
            </button>

        </aside>

    );

};

export default FilterSidebar;