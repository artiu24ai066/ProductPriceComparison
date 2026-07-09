import "./Hero.css";
import { Link } from "react-router-dom";

import heroImage from "../../../assets/hero.jpg";

const Hero = () => {
    return (
        <section
            className="hero"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            <div className="hero-overlay"></div>

            <div className="hero-content">

                <span className="hero-tag">
                    AI Powered Price Comparison
                </span>

                <h1>
                    Find the Best Price
                    <br />
                    Before You Buy.
                </h1>

                <p>
                    Compare prices across multiple shopping platforms in seconds.
                    Discover deals, track price history, and make smarter purchases
                    with PriceWise.
                </p>

                <div className="hero-buttons">

                    <Link to="/signup" className="hero-primary">
                        Get Started
                    </Link>

                    <a href="#features" className="hero-secondary">
                        Explore Features
                    </a>

                </div>

            </div>
        </section>
    );
};

export default Hero;