import "./Features.css";
import {
    Search,
    TrendingUp,
    Bell,
    BarChart3,
    Heart,
    ShieldCheck,
} from "lucide-react";

const features = [
    {
        icon: <Search size={34} />,
        title: "Smart Product Search",
        description:
            "Search products across multiple shopping platforms with one powerful search.",
    },
    {
        icon: <TrendingUp size={34} />,
        title: "Real-Time Price Comparison",
        description:
            "Compare prices instantly from different online stores and find the best deal.",
    },
    {
        icon: <Bell size={34} />,
        title: "Price Drop Alerts",
        description:
            "Get notified whenever the price of your favorite product decreases.",
    },
    {
        icon: <BarChart3 size={34} />,
        title: "Price History",
        description:
            "View historical price trends before making your purchase decision.",
    },
    {
        icon: <Heart size={34} />,
        title: "Wishlist",
        description:
            "Save products to your wishlist and keep track of future discounts.",
    },
    {
        icon: <ShieldCheck size={34} />,
        title: "Trusted Sellers",
        description:
            "Compare offers only from reliable and verified online shopping platforms.",
    },
];

const Features = () => {
    return (
        <section className="features" id="features">

            <div className="features-heading">

                <h2>Why Choose PriceWise?</h2>

                <p>
                    Everything you need to make smarter shopping decisions in one place.
                </p>

            </div>

            <div className="features-grid">

                {features.map((feature, index) => (

                    <div className="feature-card" key={index}>

                        <div className="feature-icon">
                            {feature.icon}
                        </div>

                        <h3>{feature.title}</h3>

                        <p>{feature.description}</p>

                    </div>

                ))}

            </div>

        </section>
    );
};

export default Features;