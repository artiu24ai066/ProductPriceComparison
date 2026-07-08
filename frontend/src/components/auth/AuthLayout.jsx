import React from "react";
import "../../styles/auth.css";
import authImage from "../../assets/auth-bg.jpg";

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="auth-page">

            {/* Background Blur Effects */}
            <div className="bg-circle bg-circle-1"></div>
            <div className="bg-circle bg-circle-2"></div>

            <div className="auth-container">

                {/* Left Section */}
                <div className="auth-left">

                    <img
                        src={authImage}
                        alt="PPC Authentication"
                        className="auth-image"
                    />

                    <div className="image-overlay"></div>

                    <div className="image-content">

                        <h1>PricePulse</h1>

                        <p>
                            Compare prices from Amazon, Flipkart,
                            Reliance Digital, Croma and many more.
                        </p>

                    </div>

                </div>

                {/* Right Section */}

                <div className="auth-right">

                    <div className="auth-card">

                        <h2>{title}</h2>

                        <p>{subtitle}</p>

                        {children}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AuthLayout;
