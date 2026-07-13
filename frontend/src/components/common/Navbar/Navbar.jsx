import { Link } from "react-router-dom";
import {
    User,
    LogOut,
    Search,
} from "lucide-react";

import "./Navbar.css";

import logo from "../../../assets/logo.png";

const Navbar = () => {

    // Replace later with Auth Context / Redux
    const isLoggedIn = false;

    return (

        <nav className="navbar">

            <div className="navbar-container">


                {/* LOGO */}

                <Link to="/" className="brand">

                    <img
                        src={logo}
                        alt="PriceWise"
                    />

                    <h3>
                        Price<span>Wise</span>
                    </h3>

                </Link>



                {/* SEARCH BAR */}

                <div className="nav-search">

                    <Search size={20} />

                    <input
                        type="text"
                        placeholder="Search products, keywords..."
                    />

                </div>



                {
                    !isLoggedIn ? (

                        /* GUEST NAVBAR */

                        <div className="guest-actions">


                            <Link
                                to="/signup"
                                className="signup-btn"
                            >
                                Sign Up
                            </Link>


                            <Link
                                to="/login"
                                className="login-btn"
                            >
                                Login
                            </Link>


                        </div>


                    ) : (


                        /* USER NAVBAR */

                        <div className="user-actions">


                            <Link
                                to="/profile"
                                className="profile-btn"
                            >

                                <User size={21} />

                                <span>
                                    Profile
                                </span>

                            </Link>



                            <button className="logout-btn">

                                <LogOut size={18} />

                                Logout

                            </button>


                        </div>

                    )
                }


            </div>

        </nav>

    );
};

export default Navbar;