import { useEffect, useState } from "react";
import "./ProfileBanner.css";
import {
  Camera,
  Mail,
  CalendarDays,
  MapPin,
  Pencil,
} from "lucide-react";
import useAppSelector from "../../../hooks/useAppSelector";
import api from "../../../api/axios";

const ProfileBanner = ({ user, onEditProfile }) => {

  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    const fetchSearchCount = async () => {
      try {
        const response = await api.get("/users/search-history");
        setSearchCount((response.data?.data || []).length);
      } catch {
        // silently ignore — count stays 0
      }
    };
    fetchSearchCount();
  }, []);

  return (
    <section className="profile-banner">

      <div className="banner-bg-circle banner-blue"></div>
      <div className="banner-bg-circle banner-orange"></div>

      <div className="banner-cover">

        <div className="profile-image-wrapper">

          <img
            src="https://i.pravatar.cc/220"
            alt="Profile"
            className="profile-image"
          />

          <button className="change-photo-btn">
            <Camera size={18} />
          </button>

        </div>

        <div className="profile-info">

          <div className="profile-badges">
            <span>Premium Member</span>
            <span>Verified</span>
          </div>

          <h1>{user?.fullname || "Your Name"}</h1>

          <p>
            Smart shopping enthusiast who never misses the best deal.
          </p>

          <div className="profile-meta">

            <div>
              <Mail size={17} />
              {user?.email || "your@email.com"}
            </div>

            <div>
              <MapPin size={17} />
              India
            </div>

            <div>
              <CalendarDays size={17} />
              Joined recently
            </div>

          </div>

        </div>

        <button className="edit-profile-btn" onClick={onEditProfile}>
          <Pencil size={18} />
          Edit Profile
        </button>

      </div>

      <div className="profile-stats">

        <div className="stat-box">
          <h2>{wishlistCount}</h2>
          <span>Wishlist</span>
        </div>

        <div className="stat-box">
          <h2>{searchCount}</h2>
          <span>Searches</span>
        </div>

        <div className="stat-box">
          <h2>19</h2>
          <span>Price Alerts</span>
        </div>

        <div className="stat-box">
          <h2>₹18,250</h2>
          <span>Total Saved</span>
        </div>

      </div>

    </section>
  );
};

export default ProfileBanner;