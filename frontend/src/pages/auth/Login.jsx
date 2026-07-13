import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

const Login = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
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

        if (!formData.email || !formData.password) {
            alert("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/users/login", {
                email: formData.email,
                password: formData.password,
            });

            const { token, user } = response.data;

            if (formData.rememberMe) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("user", JSON.stringify(user));
            }

            navigate("/");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Invalid email or password."
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
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
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

                    <Link
                        to="/forgot-password"
                        className="forgot-link"
                    >
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

                <Link to="/signup">
                    Create One
                </Link>

            </div>

        </AuthLayout>
    );
};

export default Login;