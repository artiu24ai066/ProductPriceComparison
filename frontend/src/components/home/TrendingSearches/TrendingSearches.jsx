import "./TrendingSearches.css";
import { TrendingUp, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const fallbackSearches = [
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

const splitIntoRows = (items = []) => {
    const rows = [[], [], []];

    items.forEach((item, index) => {
        rows[index % rows.length].push(item);
    });

    return rows;
};

const Trending = () => {
    const [trendingRows, setTrendingRows] = useState(splitIntoRows(fallbackSearches));
    const [searchesCount, setSearchesCount] = useState(0);
    const [registeredUsersCount, setRegisteredUsersCount] = useState(0);

    useEffect(() => {
        let isActive = true;

        const loadTrendingStats = async () => {
            try {
                const response = await api.get("/products/home-trending");
                const payload = response.data?.data || {};
                const liveSearches = payload.trendingSearches?.map((item) => item.query).filter(Boolean) || [];

                if (!isActive) return;

                setTrendingRows(splitIntoRows(liveSearches.length ? liveSearches : fallbackSearches));
                setSearchesCount(payload.searchesCount || 0);
                setRegisteredUsersCount(payload.registeredUsersCount || 0);
            } catch (error) {
                if (!isActive) return;

                setTrendingRows(splitIntoRows(fallbackSearches));
            }
        };

        loadTrendingStats();

        return () => {
            isActive = false;
        };
    }, []);

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

                    {[...trendingRows[0], ...trendingRows[0]].map((item, index) => (

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

                    {[...trendingRows[1], ...trendingRows[1]].map((item, index) => (

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

                    {[...trendingRows[2], ...trendingRows[2]].map((item, index) => (

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

                    <h3>{searchesCount.toLocaleString()}</h3>

                    <p>Daily Searches</p>

                </div>

                <div className="trending-searches-stat-card">

                    <Users size={34} />

                    <h3>{registeredUsersCount.toLocaleString()}</h3>

                    <p>Registered Users</p>

                </div>

            </div>

        </section>
    );
};

export default Trending;