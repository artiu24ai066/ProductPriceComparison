import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import Button from "../Button/Button";

import "./SearchBar.css";

const SearchBar = ({
    placeholder = "Search for products, brands & more...",
    }) => {

    const [query, setQuery] = useState("");

    const navigate = useNavigate();

    const handleSearch = () => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;
        navigate(`/search-results?q=${encodeURIComponent(trimmedQuery)}`);
    };

    return (
        <div className="searchbar">

            <FiSearch className="searchbar-icon" />

            <input
                type="text"
                className="searchbar-input"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />

            <div className="searchbar-button">

                <Button
                    variant="primary"
                    onClick={handleSearch}
                >
                    Search
                </Button>

            </div>

        </div>
    );
};

export default SearchBar;