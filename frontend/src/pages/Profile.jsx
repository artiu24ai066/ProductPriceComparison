import { useState } from "react";
import Navbar from "../components/common/Navbar/Navbar.jsx"
import Footer from "../components/common/Footer/Footer.jsx"
import ProfileBanner from "../components/profile/ProfileBanner/ProfileBanner";

import ProfileSidebar from "../components/profile/ProfileSidebar/ProfileSidebar";

import PersonalInfo from "../components/profile/PersonalInfo/PersonalInfo";
import Wishlist from "../components/profile/Wishlist/Wishlist";

import SearchHistory from "../components/profile/SearchHistory/SearchHistory";

import PriceAlerts from "../components/profile/PriceAlerts/PriceAlerts";

import Settings from "../components/profile/Settings/Settings";

import "../styles/Profile.css";

const Profile = () => {

    const [activeTab, setActiveTab] = useState("profile");

    return (

        <>

            <Navbar />
            <ProfileBanner />

            <section className="profile-dashboard">

                <div className="profile-layout">

                    <ProfileSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <div className="profile-right">

                        {activeTab === "profile" && <PersonalInfo />}

                        {activeTab === "wishlist" && <Wishlist />}

                        {activeTab === "history" && <SearchHistory />}

                        {activeTab === "alerts" && <PriceAlerts />}

                        {activeTab === "settings" && <Settings />}

                    </div>

                </div>

            </section>

            <Footer />

        </>

    );

};

export default Profile;