import "./AIRecommendation.css";

import {
    Sparkles,
    ShieldCheck,
    TrendingUp,
    BadgeCheck,
    IndianRupee,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
} from "lucide-react";

const reasons = [
    "Lowest verified price today",
    "Trusted seller with excellent ratings",
    "Currently available in stock",
    "Best value compared to other stores",
    "AI predicts price may increase soon",
];

const AIRecommendation = () => {
    return (

        <section className="ai-section">

            {/* Heading */}

            <div className="ai-heading">

                <span className="section-tag">
                    <Sparkles size={15} />
                    AI Powered
                </span>

                <h2>AI Recommendation</h2>

                <p>
                    Our AI compares prices, seller reputation, ratings and
                    price trends to recommend the smartest buying option.
                </p>

            </div>

            {/* Main Layout */}

            <div className="ai-layout">

                {/* LEFT */}

                <div className="ai-left">

                    <div className="ai-pick">

                        <div className="ai-icon">
                            <BrainCircuit size={28} />
                        </div>

                        <div>

                            <span className="pick-label">
                                AI PICK
                            </span>

                            <h3>Amazon</h3>

                            <p>
                                Amazon currently provides the best overall
                                value for the iPhone 19 Pro Max because it
                                combines the lowest verified price, trusted
                                seller ratings and excellent availability.
                            </p>

                        </div>

                    </div>

                    <div className="reason-list">

                        {reasons.map((reason) => (

                            <div
                                key={reason}
                                className="reason-item"
                            >

                                <CheckCircle2 size={18} />

                                <span>{reason}</span>

                            </div>

                        ))}

                    </div>

                    <div className="prediction-card">

                        <TrendingUp size={22} />

                        <div>

                            <h4>AI Price Prediction</h4>

                            <p>

                                Prices are expected to increase by
                                <strong> ₹2,000</strong>
                                within the next
                                <strong> 3–5 days.</strong>

                            </p>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="ai-right">

                    <div className="score-circle">

                        <span>97%</span>

                        <small>Confidence</small>

                    </div>

                    <div className="score-cards">

                        <div>

                            <IndianRupee size={18} />

                            <h4>₹1,24,999</h4>

                            <span>Best Price</span>

                        </div>

                        <div>

                            <ShieldCheck size={18} />

                            <h4>Verified</h4>

                            <span>Seller</span>

                        </div>

                        <div>

                            <BadgeCheck size={18} />

                            <h4>4.8/5</h4>

                            <span>User Rating</span>

                        </div>

                    </div>

                    <button className="best-deal-btn">

                        View Best Deal

                        <ArrowRight size={18} />

                    </button>

                </div>

            </div>

        </section>

    );
};

export default AIRecommendation;