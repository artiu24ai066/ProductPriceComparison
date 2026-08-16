import { useEffect, useState } from "react";
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
  LocateFixed,
  Loader2,
} from "lucide-react";
import api from "../../../api/axios";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { restoreUser } from "../../../features/auth/authSlice";

// ─── Reverse-geocode using OpenStreetMap Nominatim (free, no API key) ────────
const reverseGeocode = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "PriceWise-App" },
  });
  if (!res.ok) throw new Error("Reverse geocoding request failed.");
  const data = await res.json();
  const a = data.address || {};

  return {
    country: a.country || "",
    // Nominatim uses state / state_district / region depending on country
    state:   a.state || a.state_district || a.region || "",
    // City → town → village → county fallback chain
    city:    a.city || a.town || a.village || a.suburb || a.county || "",
    pincode: a.postcode || "",
  };
};

const PersonalInfo = ({ user, sectionRef }) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
  });

  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }
  const [locating, setLocating] = useState(false);
  const [locMsg, setLocMsg] = useState(null); // { type: "success"|"error", text }

  // Populate from user prop whenever it changes
  useEffect(() => {
    setFormData({
      fullname: user?.fullname || "",
      username: user?.username || user?.email?.split("@")[0] || "",
    });
    setAddress({
      country: user?.address?.country || "",
      state:   user?.address?.state   || "",
      city:    user?.address?.city    || "",
      pincode: user?.address?.pincode || "",
    });
  }, [user]);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAddressChange = (field) => (e) =>
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Use Current Location ──────────────────────────────────────────────────
  const handleUseLocation = () => {
    setLocMsg(null);

    if (!navigator.geolocation) {
      setLocMsg({ type: "error", text: "Your browser does not support geolocation." });
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await reverseGeocode(latitude, longitude);
          setAddress(result);
          setLocMsg({
            type: "success",
            text: "Location detected! Review the fields below and click Save Changes.",
          });
        } catch {
          setLocMsg({
            type: "error",
            text: "Could not determine your address. Please enter it manually.",
          });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        const messages = {
          1: "Location permission denied. Please allow access and try again.",
          2: "Your location could not be determined. Please enter your address manually.",
          3: "Location request timed out. Please try again.",
        };
        setLocMsg({
          type: "error",
          text: messages[err.code] || "Failed to get location. Please enter your address manually.",
        });
      },
      { timeout: 15000, enableHighAccuracy: false }
    );
  };

  // ── Save ──────────────────────────────────────────────────────────────────
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
        address: {
          country: address.country.trim(),
          state:   address.state.trim(),
          city:    address.city.trim(),
          pincode: address.pincode.trim(),
        },
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

      {/* ── Personal Information card ──────────────────────────────────── */}
      <div className="info-card">

        <h2>Personal Information</h2>
        <p>Update your profile information and contact details.</p>

        <div className="info-grid">

          {/* Full Name */}
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
            <label>
              Email <span className="readonly-badge">Read-only</span>
            </label>
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

          {/* Phone — read-only, from database */}
          <div className="input-box">
            <label>
              Phone <span className="readonly-badge">Read-only</span>
            </label>
            <div className="profile-input profile-input--readonly">
              <Phone size={18} />
              <input
                type="tel"
                value={user?.phone || ""}
                readOnly
                tabIndex={-1}
                placeholder="Not provided"
              />
            </div>
          </div>

          {/* Username */}
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

      {/* ── Address card ───────────────────────────────────────────────── */}
      <div className="info-card">

        <div className="address-card-header">
          <div>
            <h2>Address</h2>
            <p>Used for better shopping recommendations.</p>
          </div>

          <button
            type="button"
            className="use-location-btn"
            onClick={handleUseLocation}
            disabled={locating}
          >
            {locating
              ? <Loader2 size={16} className="spin" />
              : <LocateFixed size={16} />}
            {locating ? "Detecting..." : "Use Current Location"}
          </button>
        </div>

        {/* Location status message */}
        {locMsg && (
          <div className={`loc-message loc-message--${locMsg.type}`}>
            {locMsg.type === "success"
              ? <CheckCircle2 size={16} />
              : <XCircle size={16} />}
            {locMsg.text}
          </div>
        )}

        <div className="info-grid">

          <div className="input-box">
            <label>Country</label>
            <div className="profile-input">
              <Globe size={18} />
              <input
                type="text"
                value={address.country}
                onChange={handleAddressChange("country")}
                placeholder="e.g. India"
              />
            </div>
          </div>

          <div className="input-box">
            <label>State</label>
            <div className="profile-input">
              <Building2 size={18} />
              <input
                type="text"
                value={address.state}
                onChange={handleAddressChange("state")}
                placeholder="e.g. Maharashtra"
              />
            </div>
          </div>

          <div className="input-box">
            <label>City</label>
            <div className="profile-input">
              <MapPin size={18} />
              <input
                type="text"
                value={address.city}
                onChange={handleAddressChange("city")}
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>

          <div className="input-box">
            <label>Pincode</label>
            <div className="profile-input">
              <Map size={18} />
              <input
                type="text"
                value={address.pincode}
                onChange={handleAddressChange("pincode")}
                placeholder="e.g. 400001"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Save message */}
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