import "./StoreComparison.css";

import {
    Store,
    ExternalLink,
    BadgePercent,
    CircleCheckBig,
    Clock3
} from "lucide-react";

const stores = [
    {
        id: 1,
        name: "Amazon",
        price: "₹1,24,999",
        updated: "2 mins ago",
        offer: "Bank Offer",
        lowest: true
    },
    {
        id: 2,
        name: "Flipkart",
        price: "₹1,25,899",
        updated: "5 mins ago",
        offer: "Exchange Bonus",
        lowest: false
    },
    {
        id: 3,
        name: "Croma",
        price: "₹1,26,499",
        updated: "1 min ago",
        offer: "No Offer",
        lowest: false
    },
    {
        id: 4,
        name: "Reliance Digital",
        price: "₹1,27,299",
        updated: "Just Now",
        offer: "Student Discount",
        lowest: false
    }
];

const StoreComparison = () => {

    return (

        <section className="store-section">

            <div className="store-heading">

                <span className="section-tag">
                    Compare Prices
                </span>

                <h2>
                    Store Comparison
                </h2>

                <p>
                    Compare verified prices from trusted retailers in one place.
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

                {stores.map((store) => (

                    <div
                        className={`table-row ${store.lowest ? "lowest-price" : ""}`}
                        key={store.id}
                    >

                        <div className="store-name">

                            <Store size={18} />

                            <div>

                                <h4>{store.name}</h4>

                                {store.lowest && (

                                    <small>

                                        <CircleCheckBig size={13} />

                                        Lowest Price

                                    </small>

                                )}

                            </div>

                        </div>

                        <div className="store-price">

                            {store.price}

                        </div>

                        <div className="updated">

                            <Clock3 size={15} />

                            {store.updated}

                        </div>

                        <div className="offer">

                            <BadgePercent size={15} />

                            {store.offer}

                        </div>

                        <button className="visit-btn">

                            Visit Store

                            <ExternalLink size={17} />

                        </button>

                    </div>

                ))}

            </div>

        </section>

    );

};

export default StoreComparison;
