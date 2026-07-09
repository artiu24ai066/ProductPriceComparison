import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="container footer-container">

                {/* Left */}

                <div className="footer-brand">

                    <h2>
                        Price<span>Wise</span>
                    </h2>

                    <p>
                        Compare prices across trusted online stores and
                        always shop at the best price.
                    </p>

                </div>

                {/* Quick Links */}

                <div className="footer-links">

                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>

                    <Link to="/search-results">
                        Search Results
                    </Link>


                </div>

                {/* User */}

                <div className="footer-links">

                    <h3>User</h3>

                    <Link to="/wishlist">
                        Wishlist
                    </Link>

                    <Link to="/search-history">
                        Search History
                    </Link>

                    <Link to="/notifications">
                        Notifications
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                </div>

                {/* Stores */}

                <div className="footer-links">

                    <h3>Supported Stores</h3>

                    <span>Amazon</span>

                    <span>Flipkart</span>

                    <span>Croma</span>

                    <span>Reliance Digital</span>

                </div>

            </div>

            <div className="footer-bottom">

                © 2026 PricePulse • Internship Project • Built with React, Node, Express & MongoDB

            </div>

        </footer>
    );
};

export default Footer;