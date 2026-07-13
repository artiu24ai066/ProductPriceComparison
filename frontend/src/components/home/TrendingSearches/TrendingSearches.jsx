import "./TrendingSearches.css";
import { TrendingUp, Search, Users } from "lucide-react";

const searches = [
    "iPhone 16 Pro Max",
    "Samsung Galaxy S26",
    "MacBook Air M5",
    "Sony WH-1000XM6",
    "Nike Air Max",
    "PlayStation 6",
    "OnePlus 15",
    "Apple Watch Ultra",
    "Canon EOS R8",
    "RTX 5090",
];

const Trending = () => {
    return (
        <section className="trending-searches-section">

            <div className="trending-searches-glow trending-searches-glow-left"></div>
            <div className="trending-searches-glow trending-searches-glow-right"></div>

            <div className="trending-searches-header">

                <span className="trending-searches-live-tag">
                    LIVE TRENDING
                </span>

                <h2>What's Trending Today?</h2>

                <p>
                    Discover what PriceWise users are searching for the most.
                </p>

            </div>

            {/* Row 1 */}

            <div className="trending-searches-marquee">

                <div className="trending-searches-track trending-searches-slow">

                    {[...searches, ...searches].map((item, index) => (

                        <div className="trending-searches-card" key={index}>

                            <TrendingUp size={18} />

                            <div>

                                <h4>{item}</h4>

                                <span>Popular Search</span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* Row 2 */}

            <div className="trending-searches-marquee">

                <div className="trending-searches-track trending-searches-medium">

                    {[...searches, ...searches].map((item, index) => (

                        <div className="trending-searches-card" key={index}>

                            <TrendingUp size={18} />

                            <div>

                                <h4>{item}</h4>

                                <span>Popular Search</span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* Row 3 */}

            <div className="trending-searches-marquee">

                <div className="trending-searches-track trending-searches-fast">

                    {[...searches, ...searches].map((item, index) => (

                        <div className="trending-searches-card" key={index}>

                            <TrendingUp size={18} />

                            <div>

                                <h4>{item}</h4>

                                <span>Popular Search</span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <div className="trending-searches-stats">

                <div className="trending-searches-stat-card">

                    <Search size={34} />

                    <h3>0</h3>

                    <p>Daily Searches</p>

                </div>

                <div className="trending-searches-stat-card">

                    <Users size={34} />

                    <h3>0</h3>

                    <p>Registered Users</p>

                </div>

            </div>

        </section>
    );
};

export default Trending;