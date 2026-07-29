import "./SearchHeader.css";

const SearchHeader = ({ query, totalProducts }) => {
    return (

        <section className="search-header">

            <div className="search-header-left">

                <span className="live-badge">
                    ● Live Prices
                </span>

                <h1>
                    Results for <span>"{query}"</span>
                </h1>

                <p>
                    Compare prices from India's top online stores.
                </p>

            </div>


            <div className="search-header-right">

                <div className="header-stat">

                    <h2>{totalProducts}</h2>

                    <span>Products</span>

                </div>

                <div className="header-stat">

                    <h2>5</h2>

                    <span>Stores</span>

                </div>

                <div className="header-stat">

                    <h2>2 min</h2>

                    <span>Updated</span>

                </div>

            </div>

        </section>

    );
};

export default SearchHeader;