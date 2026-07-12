import "./Users.css";
import {
    Search,
    ExternalLink,
    Activity
} from "lucide-react";


const users = [

    {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul@example.com",
        searches: 124,
        saved: 8,
        status: "Active"
    },

    {
        id: 2,
        name: "Priya Patel",
        email: "priya@example.com",
        searches: 98,
        saved: 12,
        status: "Active"
    },

    {
        id: 3,
        name: "Arjun Kumar",
        email: "arjun@example.com",
        searches: 54,
        saved: 3,
        status: "Inactive"
    },

    {
        id: 4,
        name: "Sneha Reddy",
        email: "sneha@example.com",
        searches: 210,
        saved: 18,
        status: "Active"
    }

];



const Users = () => {


    return (

        <div className="users-page">



            <div className="users-header">

                <div>

                    <h1>
                        Users
                    </h1>

                    <p>
                        Monitor user activity, searches and saved comparisons.
                    </p>

                </div>


            </div>




            <div className="users-search">

                <Search size={20} />

                <input
                    placeholder="Search users..."
                />

            </div>




            <div className="users-table">



                <div className="users-table-head">

                    <span>
                        User
                    </span>

                    <span>
                        Searches
                    </span>

                    <span>
                        Saved Products
                    </span>

                    <span>
                        Activity
                    </span>

                    <span>
                        Status
                    </span>

                    <span>
                    </span>


                </div>




                {
                    users.map(user => (


                        <div
                            className="users-row"
                            key={user.id}
                        >



                            <div className="user-profile-admin">


                                <div className="user-circle">

                                    {
                                        user.name.charAt(0)
                                    }

                                </div>


                                <div>

                                    <h4>
                                        {user.name}
                                    </h4>

                                    <p>
                                        {user.email}
                                    </p>


                                </div>


                            </div>




                            <span>
                                {user.searches}
                            </span>



                            <span>
                                {user.saved}
                            </span>




                            <div className="activity">

                                <Activity size={17} />

                                Active browsing

                            </div>





                            <span
                                className={
                                    user.status === "Active"
                                        ?
                                        "user-status active"
                                        :
                                        "user-status inactive"
                                }
                            >

                                {user.status}

                            </span>





                            <button className="user-view-btn">

                                <ExternalLink size={18} />

                            </button>



                        </div>


                    ))


                }



            </div>




        </div>

    )

}


export default Users;