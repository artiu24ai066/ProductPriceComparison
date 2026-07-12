import "./AdminTopbar.css";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";

const AdminTopbar = () => {
  return (
    <header className="admin-topbar">

      <button className="menu-btn">
        <Menu size={22} />
      </button>

      <div className="topbar-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search products, users..."
        />

      </div>

      <div className="topbar-right">

        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="admin-profile">

          <img
            src="https://i.pravatar.cc/100"
            alt="Admin"
          />

          <div className="admin-info">
            <h4>Admin</h4>
            <p>admin@ppc.com</p>
          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
};

export default AdminTopbar;