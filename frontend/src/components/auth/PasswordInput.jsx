import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
    placeholder,
    name,
    value,
    onChange,
}) => {
    const [showPassword, setShowPassword] =
        useState(false);

    return (
        <div className="input-group">

            <span className="input-icon">
                <Lock size={20} />
            </span>

            <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
            />

            <button
                type="button"
                className="eye-btn"
                onClick={() =>
                    setShowPassword(!showPassword)
                }
            >
                {showPassword ? (
                    <EyeOff size={20} />
                ) : (
                    <Eye size={20} />
                )}
            </button>

        </div>
    );
};

export default PasswordInput;
