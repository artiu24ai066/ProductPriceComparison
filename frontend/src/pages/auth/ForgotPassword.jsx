import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email,
      });

      alert(
        response.data.message ||
        "Password reset link sent successfully."
      );

      setEmail("");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to send reset link."
      );
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

        <AuthButton
          text="Send Reset Link"
          loading={loading}
        />

      </form>

      <div className="auth-footer">
        <Link to="/login">
          Back to Login
        </Link>
      </div>

    </AuthLayout>
  );
};

export default ForgotPassword;