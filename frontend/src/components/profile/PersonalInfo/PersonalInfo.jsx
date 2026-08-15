import { useEffect, useRef, useState } from "react";
import "./PersonalInfo.css";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Map,
  Hash,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import api from "../../../api/axios";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { restoreUser } from "../../../features/auth/authSlice";

const PersonalInfo = ({ user, sectionRef }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ fullname: "", username: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }

  useEffect(() => {
    setFormData({
      fullname: user?.fullname || "",
      username: user?.username || user?.email?.split("@")[0] || "",
    });
  }, [user]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullname.trim()) {
      setMessage({ type: "error", text: "Full name cannot be empty." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await api.patch("/users/update-account", {
        fullname: formData.fullname.trim(),
        username: formData.username.trim(),
      });
      dispatch(restoreUser({ user: response.data.data }));
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (

    <div className="personal-info" ref={sectionRef}>

      <div className="info-card">

        <h2>Personal Information</h2>

        <p>
          Update your profile information and contact details.
        </p>

        <div className="info-grid">

          {/* Full Name — editable */}
          <div className="input-box">
            <label>Full Name</label>
            <div className="profile-input">
              <User size={18} />
              <input
                type="text"
                value={formData.fullname}
                onChange={handleChange("fullname")}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email — read-only */}
          <div className="input-box">
            <label>Email <span className="readonly-badge">Read-only</span></label>
            <div className="profile-input profile-input--readonly">
              <Mail size={18} />
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                tabIndex={-1}
              />
            </div>
          </div>

          {/* Phone — static for now */}
          <div className="input-box">
            <label>Phone</label>
            <div className="profile-input">
              <Phone size={18} />
              <input type="text" defaultValue="+91 9876543210" />
            </div>
          </div>

          {/* Username — editable */}
          <div className="input-box">
            <label>Username</label>
            <div className="profile-input">
              <Hash size={18} />
              <input
                type="text"
                value={formData.username}
                onChange={handleChange("username")}
                placeholder="Enter your username"
              />
            </div>
          </div>

        </div>

      </div>

      <div className="info-card">

        <h2>Address</h2>

        <p>
          Used for better shopping recommendations.
        </p>

        <div className="info-grid">

          <div className="input-box">
            <label>Country</label>
            <div className="profile-input">
              <Globe size={18} />
              <input type="text" defaultValue="India" />
            </div>
          </div>

          <div className="input-box">
            <label>State</label>
            <div className="profile-input">
              <Building2 size={18} />
              <input type="text" defaultValue="Telangana" />
            </div>
          </div>

          <div className="input-box">
            <label>City</label>
            <div className="profile-input">
              <MapPin size={18} />
              <input type="text" defaultValue="Hyderabad" />
            </div>
          </div>

          <div className="input-box">
            <label>Pincode</label>
            <div className="profile-input">
              <Map size={18} />
              <input type="text" defaultValue="500001" />
            </div>
          </div>

        </div>

      </div>

      {/* Success / error message */}
      {message && (
        <div className={`save-message save-message--${message.type}`}>
          {message.type === "success"
            ? <CheckCircle2 size={18} />
            : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      <button
        className="save-profile-btn"
        type="button"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>

  );

};

export default PersonalInfo;