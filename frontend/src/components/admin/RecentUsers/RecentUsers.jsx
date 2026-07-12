import "./RecentUsers.css";

const users = [
    {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul@example.com",
        joined: "2 mins ago",
    },
    {
        id: 2,
        name: "Priya Patel",
        email: "priya@example.com",
        joined: "10 mins ago",
    },
    {
        id: 3,
        name: "Arjun Kumar",
        email: "arjun@example.com",
        joined: "35 mins ago",
    },
    {
        id: 4,
        name: "Sneha Reddy",
        email: "sneha@example.com",
        joined: "1 hour ago",
    },
];

const RecentUsers = () => {
    return (
        <div className="recent-users">

            <div className="recent-users-header">
                <h2>Recent Users</h2>
                <p>Newest registered users</p>
            </div>

            <div className="recent-users-list">

                {users.map((user) => (

                    <div className="recent-user-card" key={user.id}>

                        <div className="user-avatar">
                            {user.name.charAt(0)}
                        </div>

                        <div className="user-details">

                            <h4>{user.name}</h4>

                            <span>{user.email}</span>

                        </div>

                        <small>{user.joined}</small>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default RecentUsers;