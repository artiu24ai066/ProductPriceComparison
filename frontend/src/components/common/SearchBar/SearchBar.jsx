import { useState } from "react";
import "./SearchBar.css";
import { FiSearch } from "react-icons/fi";
import Button from "../Button/Button";

const SearchBar = ({
    placeholder = "Search for products, brands & more...",
    onSearch,
}) => {

    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(query);
        }
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
                <Button variant="primary" onClick={handleSearch}>
                    Search
                </Button>
            </div>

        </div>
    );
};

export default SearchBar;