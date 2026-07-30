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
  Hash
} from "lucide-react";
import api from "../../../api/axios";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { restoreUser } from "../../../features/auth/authSlice";

const PersonalInfo = ({ user }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ fullname: "", email: "", username: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      fullname: user?.fullname || "",
      email: user?.email || "",
      username: user?.username || user?.email?.split("@")[0] || "",
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await api.patch("/users/update-account", {
        fullname: formData.fullname,
        email: formData.email,
      });

      dispatch(restoreUser({ user: response.data.data }));
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  return (

    <div className="personal-info">

      <div className="info-card">

        <h2>Personal Information</h2>

        <p>
          Update your profile information and contact details.
        </p>

        <div className="info-grid">

          <div className="input-box">
            <label>Full Name</label>

            <div className="profile-input">
              <User size={18}/>
              <input
                type="text"
                value={formData.fullname}
                onChange={handleChange("fullname")}
              />
            </div>

          </div>

          <div className="input-box">

            <label>Email</label>

            <div className="profile-input">
              <Mail size={18}/>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
              />
            </div>

          </div>

          <div className="input-box">

            <label>Phone</label>

            <div className="profile-input">
              <Phone size={18}/>
              <input
                type="text"
                defaultValue="+91 9876543210"
              />
            </div>

          </div>

          <div className="input-box">

            <label>Username</label>

            <div className="profile-input">
              <Hash size={18}/>
              <input
                type="text"
                value={formData.username}
                onChange={handleChange("username")}
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
              <Globe size={18}/>
              <input
                type="text"
                defaultValue="India"
              />
            </div>

          </div>

          <div className="input-box">

            <label>State</label>

            <div className="profile-input">
              <Building2 size={18}/>
              <input
                type="text"
                defaultValue="Telangana"
              />
            </div>

          </div>

          <div className="input-box">

            <label>City</label>

            <div className="profile-input">
              <MapPin size={18}/>
              <input
                type="text"
                defaultValue="Hyderabad"
              />
            </div>

          </div>

          <div className="input-box">

            <label>Pincode</label>

            <div className="profile-input">
              <Map size={18}/>
              <input
                type="text"
                defaultValue="500001"
              />
            </div>

          </div>

        </div>

      </div>

      <button className="save-profile-btn" type="button" onClick={handleSave} disabled={saving}>

        {saving ? "Saving..." : "Save Changes"}

      </button>

    </div>

  );

};

export default PersonalInfo;