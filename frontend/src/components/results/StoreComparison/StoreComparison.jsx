import "./StoreComparison.css";

import {
    Store,
    ExternalLink,
    BadgePercent,
    CircleCheckBig,
    Clock3
} from "lucide-react";

const formatPrice = (price) =>
    price != null ? `${Number(price).toLocaleString("en-IN")}` : "N/A";

const formatUpdated = (seller, product) => {
    const timestamp = seller?.scrapedAt || product?.lastUpdated;
    if (!timestamp) return "Just Now";
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getOfferText = (seller) => {
    return seller?.bankOffer || seller?.exchangeOffer || seller?.coupon || seller?.discount || "No Offer";
};

const StoreComparison = ({ product }) => {
    const sellers = product?.sellers || [];
    const lowestPrice = sellers.length
        ? Math.min(...sellers.map((seller) => seller.price ?? Infinity))
        : null;

    return (
        <section className="store-section">
            <div className="store-heading">
                <span className="section-tag">Compare Prices</span>
                <h2>Store Comparison</h2>
                <p>
                    {product
                        ? `Compare verified prices for ${product.canonicalTitle || product.brand || "this product"}.`
                        : "Compare verified prices from trusted retailers in one place."}
                </p>
            </div>

            <div className="store-table">
                <div className="table-head">
                    <span>Store</span>
                    <span>Price</span>
                    <span>Last Updated</span>
                    <span>Offer</span>
                    <span>Action</span>
                </div>

                {sellers.length ? (
                    sellers.map((seller, index) => (
                        <div
                            className={`table-row ${seller.price === lowestPrice ? "lowest-price" : ""}`}
                            key={seller.url || `${seller.website}-${index}`}
                        >
                            <div className="store-name">
                                <Store size={18} />
                                <div>
                                    <h4>{seller.sellerName || seller.website || "Store"}</h4>
                                    {seller.price === lowestPrice && (
                                        <small>
                                            <CircleCheckBig size={13} />
                                            Lowest Price
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="store-price">{formatPrice(seller.price)}</div>

                            <div className="updated">
                                <Clock3 size={15} />
                                {formatUpdated(seller, product)}
                            </div>

                            <div className="offer">
                                <BadgePercent size={15} />
                                {getOfferText(seller)}
                            </div>

                            {seller.url ? (
                                <a
                                    className="visit-btn"
                                    href={seller.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Store
                                    <ExternalLink size={17} />
                                </a>
                            ) : (
                                <button className="visit-btn" type="button" disabled>
                                    Visit Store
                                    <ExternalLink size={17} />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="table-row no-data">
                        <div className="store-name">
                            <h4>No store pricing available</h4>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default StoreComparison;
