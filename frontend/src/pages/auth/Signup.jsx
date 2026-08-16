import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone } from "lucide-react";

import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullname, email, phone, password, confirmPassword } = formData;

        if (!fullname || !email || !phone || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/users/register", {
                fullname,
                email,
                phone,
                password,
            });

            alert(response.data.message || "Account created successfully!");
            navigate("/login");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Create your account and start comparing smarter."
        >
            <form onSubmit={handleSubmit} className="auth-form">

                <AuthInput
                    icon={User}
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                />

                <AuthInput
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                />

                <AuthInput
                    icon={Phone}
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits or +91XXXXXXXXXX)"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <PasswordInput
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <AuthButton
                    text="Create Account"
                    loading={loading}
                />

            </form>

            <div className="auth-footer">
                <span>Already have an account?</span>
                <Link to="/login">Login</Link>
            </div>

        </AuthLayout>
    );
};

export default Signup;