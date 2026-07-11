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

const PersonalInfo = () => {

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
                defaultValue="Arti Jangid"
              />
            </div>

          </div>

          <div className="input-box">

            <label>Email</label>

            <div className="profile-input">
              <Mail size={18}/>
              <input
                type="email"
                defaultValue="arti@gmail.com"
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
                defaultValue="arti_j"
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

      <button className="save-profile-btn">

        Save Changes

      </button>

    </div>

  );

};

export default PersonalInfo;