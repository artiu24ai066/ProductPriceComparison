import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

import api from "../../api/axios";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

const MIN_PASSWORD_LENGTH = 8;

const ChangePassword = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState(null); // { type: "success"|"error", text }

    const [formData, setFormData] = useState({
        oldPassword:     "",
        newPassword:     "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        const { oldPassword, newPassword, confirmPassword } = formData;

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage({ type: "error", text: "Please fill in all fields." });
            return;
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            setMessage({
                type: "error",
                text: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }

        if (oldPassword === newPassword) {
            setMessage({
                type: "error",
                text: "New password must be different from your current password.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await api.patch("/users/change-password", {
                oldPassword,
                newPassword,
            });

            setSuccess(true);
            setMessage({
                type: "success",
                text: response.data.message || "Password changed successfully!",
            });

            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

            // Redirect to profile settings after 2 seconds
            setTimeout(() => navigate("/profile"), 2000);

        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message ||
                    "Failed to change password. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Change Password"
            subtitle="Update your account password to keep it secure."
        >
            {success ? (

                <div className="auth-form">
                    <div className="auth-message auth-message--success">
                        <CheckCircle2 size={16} />
                        {message?.text}
                    </div>
                    <p style={{ color: "#9BA4B5", fontSize: "14px", textAlign: "center" }}>
                        Redirecting you back to your profile…
                    </p>
                </div>

            ) : (

                <form onSubmit={handleSubmit} className="auth-form">

                    <PasswordInput
                        name="oldPassword"
                        placeholder="Current Password"
                        value={formData.oldPassword}
                        onChange={handleChange}
                    />

                    <PasswordInput
                        name="newPassword"
                        placeholder={`New Password (min. ${MIN_PASSWORD_LENGTH} characters)`}
                        value={formData.newPassword}
                        onChange={handleChange}
                    />

                    <PasswordInput
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                        text="Update Password"
                        loading={loading}
                    />

                </form>

            )}

            <div className="auth-footer">
                <Link to="/profile">Back to Profile</Link>
            </div>

        </AuthLayout>
    );
};

export default ChangePassword;
