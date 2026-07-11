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
        <section className="trending-section">

            <div className="glow glow-left"></div>
            <div className="glow glow-right"></div>

            <div className="trending-header">

                <span className="live-tag">
                    LIVE TRENDING
                </span>

                <h2>What's Trending Today?</h2>

                <p>
                    Discover what PriceWise users are searching for the most.
                </p>

            </div>

            {/* Row 1 */}

            <div className="marquee">

                <div className="track slow">

                    {[...searches, ...searches].map((item, index) => (

                        <div className="trend-card" key={index}>

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

            <div className="marquee">

                <div className="track medium">

                    {[...searches, ...searches].map((item, index) => (

                        <div className="trend-card" key={index}>

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

            <div className="marquee">

                <div className="track fast">

                    {[...searches, ...searches].map((item, index) => (

                        <div className="trend-card" key={index}>

                            <TrendingUp size={18} />

                            <div>

                                <h4>{item}</h4>

                                <span>Popular Search</span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <div className="home-stats">

                <div className="home-stat-card">

                    <Search size={34} />

                    <h3>0</h3>

                    <p>Daily Searches</p>

                </div>

                <div className="home-stat-card">

                    <Users size={34} />

                    <h3>0</h3>

                    <p>Registered Users</p>

                </div>

            </div>

        </section>
    );
};

export default Trending;