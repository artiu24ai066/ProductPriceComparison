import "./ProfileSidebar.css";

import {
    User,
    Heart,
    Search,
    Bell,
    Settings,
    LogOut
} from "lucide-react";

const menu = [

    {
        id: "profile",
        title: "Personal Info",
        icon: <User size={20}/>
    },

    {
        id: "wishlist",
        title: "Wishlist",
        icon: <Heart size={20}/>
    },

    {
        id: "history",
        title: "Search History",
        icon: <Search size={20}/>
    },

    {
        id: "alerts",
        title: "Price Alerts",
        icon: <Bell size={20}/>
    },

    {
        id: "settings",
        title: "Settings",
        icon: <Settings size={20}/>
    }

];

const ProfileSidebar = ({ activeTab, setActiveTab }) => {

    return (

        <aside className="profile-sidebar">

            <div className="sidebar-top">

                {menu.map((item) => (

                    <button

                        key={item.id}

                        onClick={() => setActiveTab(item.id)}

                        className={`sidebar-item ${
                            activeTab === item.id ? "active" : ""
                        }`}

                    >

                        {item.icon}

                        <span>{item.title}</span>

                    </button>

                ))}

            </div>

            <button className="logout-sidebar">

                <LogOut size={20}/>

                Logout

            </button>

        </aside>

    );

};

export default ProfileSidebar;