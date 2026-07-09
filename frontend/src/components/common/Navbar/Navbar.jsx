import { useState } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Bell,
    Heart,
    History,
    LogOut,
    Search,
    ChevronDown
} from "lucide-react";

import "./Navbar.css";

import logo from "../../../assets/logo.png";


const Navbar = () => {

    // Replace later with Auth Context / Redux
    const isLoggedIn = false;


    const [openDropdown, setOpenDropdown] = useState(false);


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


                            <div className="profile-container">


                                <button
                                    className="profile-btn"
                                    onClick={() =>
                                        setOpenDropdown(!openDropdown)
                                    }
                                >

                                    <User size={21} />

                                    <span>
                                        Profile
                                    </span>

                                    <ChevronDown size={18} />

                                </button>



                                {
                                    openDropdown && (

                                        <div className="profile-dropdown">


                                            <Link to="/profile">

                                                <User size={18} />

                                                Profile

                                            </Link>



                                            <Link to="/notifications">

                                                <Bell size={18} />

                                                Notifications

                                            </Link>



                                            <Link to="/wishlist">

                                                <Heart size={18} />

                                                Wishlist

                                            </Link>



                                            <Link to="/history">

                                                <History size={18} />

                                                Search History

                                            </Link>


                                        </div>

                                    )
                                }


                            </div>



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