import React from "react";

const AuthButton = ({
    text,
    loading,
    type = "submit",
}) => {
    return (
        <button
            type={type}
            className="auth-btn"
            disabled={loading}
        >
            {loading ? "Please Wait..." : text}
        </button>
    );
};

export default AuthButton;