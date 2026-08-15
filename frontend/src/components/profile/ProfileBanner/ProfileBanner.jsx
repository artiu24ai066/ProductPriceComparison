import { useEffect, useRef, useState } from "react";
import "./ProfileBanner.css";
import {
  Camera,
  Mail,
  CalendarDays,
  MapPin,
  Pencil,
  User as UserIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { restoreUser } from "../../../features/auth/authSlice";
import api from "../../../api/axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ProfileBanner = ({ user, onEditProfile }) => {
  const dispatch      = useAppDispatch();
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  const [searchCount, setSearchCount] = useState(0);
  const [uploading,   setUploading]   = useState(false);
  const [removing,    setRemoving]    = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSearchCount = async () => {
      try {
        const response = await api.get("/users/search-history");
        setSearchCount((response.data?.data || []).length);
      } catch {
        // silently ignore
      }
    };
    fetchSearchCount();
  }, []);

  const handleCameraClick = () => {
    if (uploading || removing) return;
    setUploadError("");
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image must be smaller than 5 MB.");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(restoreUser({ user: response.data.data }));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (uploading || removing) return;
    setRemoving(true);
    setUploadError("");
    try {
      const response = await api.delete("/users/avatar");
      dispatch(restoreUser({ user: response.data.data }));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to remove picture. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  const avatarSrc = user?.avatar || "";
  const busy      = uploading || removing;

  return (
    <section className="profile-banner">

      <div className="banner-bg-circle banner-blue"></div>
      <div className="banner-bg-circle banner-orange"></div>

      <div className="banner-cover">

        <div className="profile-image-wrapper">

          {/* Profile picture or default icon */}
          {avatarSrc ? (
            <img src={avatarSrc} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-image profile-image--default">
              <UserIcon size={64} strokeWidth={1.2} />
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Camera button */}
          <button
            className={`change-photo-btn ${busy ? "change-photo-btn--uploading" : ""}`}
            onClick={handleCameraClick}
            disabled={busy}
            title="Change profile picture"
          >
            {uploading
              ? <Loader2 size={18} className="spin-icon" />
              : <Camera size={18} />}
          </button>

          {/* Remove button — only shown when a picture exists */}
          {avatarSrc && (
            <button
              className={`remove-photo-btn ${busy ? "change-photo-btn--uploading" : ""}`}
              onClick={handleRemoveAvatar}
              disabled={busy}
              title="Remove profile picture"
            >
              {removing
                ? <Loader2 size={15} className="spin-icon" />
                : <Trash2 size={15} />}
            </button>
          )}

          {/* Error message */}
          {uploadError && (
            <p className="avatar-error">{uploadError}</p>
          )}

        </div>

        <div className="profile-info">

          <div className="profile-badges">
            <span>Premium Member</span>
            <span>Verified</span>
          </div>

          <h1>{user?.fullname || "Your Name"}</h1>

          <p>Smart shopping enthusiast who never misses the best deal.</p>

          <div className="profile-meta">
            <div><Mail size={17} />{user?.email || "your@email.com"}</div>
            <div><MapPin size={17} />India</div>
            <div><CalendarDays size={17} />Joined recently</div>
          </div>

        </div>

        <button className="edit-profile-btn" onClick={onEditProfile}>
          <Pencil size={18} />
          Edit Profile
        </button>

      </div>

      <div className="profile-stats">
        <div className="stat-box"><h2>{wishlistCount}</h2><span>Wishlist</span></div>
        <div className="stat-box"><h2>{searchCount}</h2><span>Searches</span></div>
        <div className="stat-box"><h2>19</h2><span>Price Alerts</span></div>
        <div className="stat-box"><h2>₹18,250</h2><span>Total Saved</span></div>
      </div>

    </section>
  );
};

export default ProfileBanner;