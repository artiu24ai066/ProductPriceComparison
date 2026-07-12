import { Outlet } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar.jsx";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar.jsx";
import "./AdminLayout.css";

const AdminLayout = () => {
    return (
        <div className="admin-layout">

            <AdminSidebar />

            <div className="admin-main">

                <AdminTopbar />

                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;