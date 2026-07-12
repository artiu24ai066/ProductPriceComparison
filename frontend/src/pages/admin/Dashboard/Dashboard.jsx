import "./Dashboard.css";

import DashboardCards from "../../../components/admin/DashboardCards/DashboardCards.jsx";
import SearchChart from "../../../components/admin/Charts/SearchChart.jsx";
import RecentProducts from "../../../components/admin/RecentProducts/RecentProducts.jsx";

import RecentUsers from "../../../components/admin/RecentUsers/RecentUsers";

const Dashboard = () => {
    return (
        <div className="dashboard">

            {/* Header */}

            <div className="dashboard-header">

                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Monitor product comparisons, searches, price updates and user
                        activity.
                    </p>
                </div>

            </div>

            {/* Statistics */}

            <DashboardCards />

            {/* Middle Section */}

            <div className="dashboard-middle">

                <SearchChart />

                <RecentUsers />

            </div>
            
            {/* Bottom Section */}

            <RecentProducts />

        </div>
    );
};

export default Dashboard;