import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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

    if (!formData.password || !formData.confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password: formData.password,
        }
      );

      alert(
        response.data.message ||
        "Password updated successfully."
      );

      navigate("/login");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new secure password for your account."
    >
      <form onSubmit={handleSubmit} className="auth-form">

        <PasswordInput
          name="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange}
        />

        <PasswordInput
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <AuthButton
          text="Update Password"
          loading={loading}
        />

      </form>
    </AuthLayout>
  );
};

export default ResetPassword;