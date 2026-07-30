import "./SearchHeader.css";

const SearchHeader = ({ query, totalProducts, totalStores = 0, lastUpdated = null }) => {
    const updatedLabel = lastUpdated
        ? new Date(lastUpdated).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
          })
        : "Live";

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

                    <h2>{totalStores}</h2>

                    <span>Stores</span>

                </div>

                <div className="header-stat">

                    <h2>{updatedLabel}</h2>

                    <span>Updated</span>

                </div>

            </div>

        </section>

    );
};

export default SearchHeader;