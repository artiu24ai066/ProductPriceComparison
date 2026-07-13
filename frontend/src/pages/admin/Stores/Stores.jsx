import "./Stores.css";
import {
    RefreshCcw,
    ExternalLink,
    Search,
    Plus,
    CheckCircle2,
    AlertTriangle,
    XCircle,
} from "lucide-react";

const stores = [
    {
        id: 1,
        name: "Amazon",
        logo:
            "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        products: "8,420",
        updates: "12,540",
        accuracy: "99.2%",
        sync: "2 min ago",
        progress: 100,
        status: "Online",
    },
    {
        id: 2,
        name: "Flipkart",
        logo:
            "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.png",
        products: "7,860",
        updates: "10,230",
        accuracy: "98.8%",
        sync: "5 min ago",
        progress: 92,
        status: "Online",
    },
    {
        id: 3,
        name: "Croma",
        logo:
            "https://upload.wikimedia.org/wikipedia/commons/4/44/Croma_Logo.png",
        products: "4,320",
        updates: "5,420",
        accuracy: "96.5%",
        sync: "18 min ago",
        progress: 70,
        status: "Delayed",
    },
    {
        id: 4,
        name: "Reliance Digital",
        logo:
            "https://upload.wikimedia.org/wikipedia/commons/2/2f/Reliance_Digital_Logo.png",
        products: "3,950",
        updates: "2,870",
        accuracy: "92%",
        sync: "2 hours ago",
        progress: 40,
        status: "Offline",
    },
];

const Stores = () => {
    const getStatus = (status) => {
        if (status === "Online")
            return (
                <>
                    <CheckCircle2 size={15} />
                    Online
                </>
            );

        if (status === "Delayed")
            return (
                <>
                    <AlertTriangle size={15} />
                    Delayed
                </>
            );

        return (
            <>
                <XCircle size={15} />
                Offline
            </>
        );
    };

    return (
        <div className="stores-wrapper">
            <div className="stores-heading">
                <div>
                    <h1>Connected Stores</h1>
                    <p>Monitor and manage all price comparison sources.</p>
                </div>

                <button className="stores-add-btn">
                    <Plus size={18} />
                    Add Store
                </button>
            </div>

            <div className="stores-actions">
                <div className="stores-search">
                    <Search size={18} />
                    <input placeholder="Search stores..." />
                </div>

                <select className="stores-filter">
                    <option>All Status</option>
                    <option>Online</option>
                    <option>Delayed</option>
                    <option>Offline</option>
                </select>
            </div>

            <div className="stores-list">
                {stores.map((store) => (
                    <div className="store-box" key={store.id}>
                        <div className="store-header">
                            <img src={store.logo} alt={store.name} />

                            <div>
                                <h3>{store.name}</h3>

                                <div
                                    className={`store-status ${store.status.toLowerCase()}`}
                                >
                                    {getStatus(store.status)}
                                </div>
                            </div>
                        </div>

                        <div className="store-info-grid">
                            <div>
                                <span>Products</span>
                                <strong>{store.products}</strong>
                            </div>

                            <div>
                                <span>Updates</span>
                                <strong>{store.updates}</strong>
                            </div>

                            <div>
                                <span>Accuracy</span>
                                <strong>{store.accuracy}</strong>
                            </div>

                            <div>
                                <span>Last Sync</span>
                                <strong>{store.sync}</strong>
                            </div>
                        </div>

                        <div className="store-health">
                            <div className="store-health-head">
                                <span>Sync Health</span>
                                <span>{store.progress}%</span>
                            </div>

                            <div className="store-progress">
                                <div
                                    style={{
                                        width: `${store.progress}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="store-actions">
                            <button>
                                <RefreshCcw size={17} />
                                Sync Now
                            </button>

                            <button className="store-details-btn">
                                <ExternalLink size={17} />
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stores;