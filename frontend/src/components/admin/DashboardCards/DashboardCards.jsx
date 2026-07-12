import "./DashboardCards.css";
import {
    Users,
    Package,
    Search,
    TrendingUp,
} from "lucide-react";

const stats = [
    {
        title: "Total Users",
        value: "2,548",
        change: "+12%",
        icon: <Users size={28} />,
        color: "#4F8CFF",
    },
    {
        title: "Products",
        value: "12,486",
        change: "+36",
        icon: <Package size={28} />,
        color: "#FF8A3D",
    },
    {
        title: "Searches Today",
        value: "8,923",
        change: "+18%",
        icon: <Search size={28} />,
        color: "#6C63FF",
    },
    {
        title: "Price Updates",
        value: "452",
        change: "+67",
        icon: <TrendingUp size={28} />,
        color: "#22C55E",
    },
];

const DashboardCards = () => {
    return (
        <section className="dashboard-cards">

            {stats.map((card) => (

                <div className="dashboard-card" key={card.title}>

                    <div
                        className="dashboard-card-icon"
                        style={{ background: `${card.color}20` }}
                    >
                        <span style={{ color: card.color }}>
                            {card.icon}
                        </span>
                    </div>

                    <div className="dashboard-card-info">

                        <p>{card.title}</p>

                        <h2>{card.value}</h2>

                        <span>{card.change} this week</span>

                    </div>

                </div>

            ))}

        </section>
    );
};

export default DashboardCards;