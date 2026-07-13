import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar.jsx";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar.jsx";
import "./AdminLayout.css";

const AdminLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">

            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="admin-main">

                <AdminTopbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;