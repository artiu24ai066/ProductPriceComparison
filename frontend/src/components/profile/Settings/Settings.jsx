import "./Settings.css";

import {
  Store,
  Bell,
  Sparkles,
  Trash2,
  AlertTriangle
} from "lucide-react";

const Settings = () => {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <h2>Preferences</h2>
        <p>
          Customize your shopping experience and notification settings.
        </p>
      </div>

      {/* Preferred Stores */}

<div className="settings-card">

  <div className="card-title">

    <Store size={22} />

    <h3>Preferred Shopping Stores</h3>

  </div>

  <div className="store-grid">

    <label className="store-option">

      <input type="checkbox" defaultChecked />

      <div className="store-card">

        <span className="store-check">✓</span>

        <h4>Amazon</h4>

      </div>

    </label>

    <label className="store-option">

      <input type="checkbox" defaultChecked />

      <div className="store-card">

        <span className="store-check">✓</span>

        <h4>Flipkart</h4>

      </div>

    </label>

    <label className="store-option">

      <input type="checkbox" />

      <div className="store-card">

        <span className="store-check">✓</span>

        <h4>Croma</h4>

      </div>

    </label>

    <label className="store-option">

      <input type="checkbox" />

      <div className="store-card">

        <span className="store-check">✓</span>

        <h4>Reliance Digital</h4>

      </div>

    </label>

  </div>

</div>

      {/* Notifications */}

      <div className="settings-card">

        <div className="card-title">

          <Bell size={22} />

          <h3>Email Notifications</h3>

        </div>

        <div className="toggle-row">

          <span>Notify me when tracked products drop in price</span>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>

        </div>

        <div className="toggle-row">

          <span>Notify when wishlist items go on sale</span>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>

        </div>

        <div className="toggle-row">

          <span>Weekly deals and offers</span>

          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>

        </div>

      </div>

      {/* AI */}

      <div className="settings-card">

        <div className="card-title">

          <Sparkles size={22} />

          <h3>AI Preferences</h3>

        </div>

        <div className="toggle-row">

          <span>Show personalized recommendations</span>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>

        </div>

        <div className="toggle-row">

          <span>Suggest similar products</span>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>

        </div>

      </div>

      {/* Danger Zone */}

      <div className="danger-zone">

        <div className="danger-title">

          <AlertTriangle size={22} />

          <h3>Danger Zone</h3>

        </div>

        <p>

          These actions cannot be undone.

        </p>

        <div className="danger-buttons">

          <button className="clear-btn">

            <Trash2 size={18} />

            Clear Search History

          </button>

          <button className="delete-btn">

            Delete Account

          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;