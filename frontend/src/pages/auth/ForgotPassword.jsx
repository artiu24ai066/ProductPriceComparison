import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2, XCircle } from "lucide-react";

import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

const ForgotPassword = () => {
    const [email,   setEmail]   = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: "success"|"error", text }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage({ type: "error", text: "Please enter your email address." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await api.post("/users/forgot-password", { email });

            setMessage({
                type: "success",
                text: response.data.message ||
                    "If an account with that email exists, a reset link has been sent.",
            });

            setEmail("");

        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email to receive a password reset link."
        >
            <form onSubmit={handleSubmit} className="auth-form">

                <AuthInput
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {message && (
                    <div className={`auth-message auth-message--${message.type}`}>
                        {message.type === "success"
                            ? <CheckCircle2 size={16} />
                            : <XCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <AuthButton
                    text="Send Reset Link"
                    loading={loading}
                />

            </form>

            <div className="auth-footer">
                <Link to="/login">Back to Login</Link>
            </div>

        </AuthLayout>
    );
};

export default ForgotPassword;
