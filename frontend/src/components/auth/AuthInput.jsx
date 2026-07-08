import React from "react";

const AuthInput = ({
    icon: Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
}) => {
    return (
        <div className="input-group">

            <span className="input-icon">
                {Icon && <Icon size={20} />}
            </span>

            <input
                className="auth-input"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                autoComplete="off"
            />

        </div>
    );
};

export default AuthInput;