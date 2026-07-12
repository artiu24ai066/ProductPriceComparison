import "./AdminSidebar.css";
import {
  LayoutDashboard,
  Package,
  Users,
  FolderKanban,
  Store,
  Star,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/admin/dashboard",
  },
  {
    name: "Products",
    icon: <Package size={20} />,
    path: "/admin/products",
  },
  {
    name: "Users",
    icon: <Users size={20} />,
    path: "/admin/users",
  },
  {
    name: "Categories",
    icon: <FolderKanban size={20} />,
    path: "/admin/categories",
  },
  {
    name: "Stores",
    icon: <Store size={20} />,
    path: "/admin/stores",
  },
  {
    name: "Reviews",
    icon: <Star size={20} />,
    path: "/admin/reviews",
  },
  {
    name: "AI Recommendation",
    icon: <Sparkles size={20} />,
    path: "/admin/ai",
  },
  {
    name: "Analytics",
    icon: <BarChart3 size={20} />,
    path: "/admin/analytics",
  },
  {
    name: "Notifications",
    icon: <Bell size={20} />,
    path: "/admin/notifications",
  },
  {
    name: "Settings",
    icon: <Settings size={20} />,
    path: "/admin/settings",
  },
];

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">

      <div className="sidebar-logo">
        <h2>
          PPC<span> Admin</span>
        </h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn-admin">
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
};

export default AdminSidebar;