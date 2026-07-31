import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    User,
    LogOut,
    Search,
} from "lucide-react";

import { useState, useEffect } from "react";
import "./Navbar.css";

import logo from "../../../assets/logo.png";
import { logoutSuccess } from "../../../features/auth/authSlice";
import { clearWishlist } from "../../../features/wishlist/wishlistSlice";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";

import api from "../../../api/axios";
const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState("");

    const {
        user,
        isAuthenticated,
    } = useAppSelector((state) => state.auth);

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const handleLogout = async () => {
        try {
            await api.post("/users/logout");

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");

            dispatch(logoutSuccess());
            dispatch(clearWishlist());

            navigate("/login", { replace: true });

        } catch (error) {
            console.error("Logout failed:", error);

            // Even if the backend request fails,
            // clear the frontend auth state.
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");

            dispatch(logoutSuccess());
            dispatch(clearWishlist());

            navigate("/login", { replace: true });
        }
    };

    const handleSearch = () => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) return;

        const currentQuery = (searchParams.get("q") || "").trim();

        if (trimmedQuery.toLowerCase() === currentQuery.toLowerCase()) return;
        
        navigate(`/search-results?q=${encodeURIComponent(trimmedQuery)}`);
    };

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

                    <Search size={20} onClick={handleSearch} style={{ cursor: "pointer" }} />

                    <input
                        type="text"
                        placeholder="Search products, keywords..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />

                </div>



                {
                    !isAuthenticated ? (

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
                                        {user?.fullname?.split(" ")[0]}
                                </span>

                            </Link>



                            <button className="logout-btn" onClick={handleLogout}>

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