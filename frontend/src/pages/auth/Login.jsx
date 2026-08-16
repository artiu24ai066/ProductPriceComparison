import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AtSign } from "lucide-react";

import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

import { loginSuccess } from "../../features/auth/authSlice";
import { loadWishlist } from "../../features/wishlist/wishlistSlice";

import useAppDispatch from "../../hooks/useAppDispatch";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        identifier: "",   // email OR phone number
        password: "",
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identifier || !formData.password) {
            alert("Please enter your email or phone number and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/users/login", {
                identifier: formData.identifier,
                password: formData.password,
            });

            const { accessToken, user } = response.data.data;

            const storage = formData.rememberMe ? localStorage : sessionStorage;
            storage.setItem("accessToken", accessToken);
            storage.setItem("user", JSON.stringify(user));

            dispatch(loginSuccess({ user, accessToken }));
            dispatch(loadWishlist());

            navigate("/");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to continue comparing prices."
        >
            <form onSubmit={handleSubmit} className="auth-form">

                <AuthInput
                    icon={AtSign}
                    type="text"
                    name="identifier"
                    placeholder="Email or Phone Number"
                    value={formData.identifier}
                    onChange={handleChange}
                />

                <PasswordInput
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <div className="login-options">

                    <label className="remember-me">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <span>Remember Me</span>
                    </label>

                    <Link to="/forgot-password" className="forgot-link">
                        Forgot Password?
                    </Link>

                </div>

                <AuthButton
                    text="Login"
                    loading={loading}
                />

            </form>

            <div className="auth-footer">
                <span>Don't have an account?</span>
                <Link to="/signup">Create One</Link>
            </div>

        </AuthLayout>
    );
};

export default Login;