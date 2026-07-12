import "./Notifications.css";
import {
    Bell,
    AlertTriangle,
    CheckCircle,
    RefreshCcw
} from "lucide-react";


const notifications = [

    {
        id: 1,
        title: "Amazon price sync completed",
        message: "12,540 product prices updated successfully.",
        time: "5 minutes ago",
        type: "success"
    },

    {
        id: 2,
        title: "Flipkart API response delayed",
        message: "Price updates are taking longer than usual.",
        time: "20 minutes ago",
        type: "warning"
    },

    {
        id: 3,
        title: "New products added",
        message: "320 new products added to comparison database.",
        time: "1 hour ago",
        type: "success"
    },

    {
        id: 4,
        title: "Store connection issue",
        message: "Reliance Digital data sync failed.",
        time: "2 hours ago",
        type: "error"
    }

];



const Notifications = () => {


    return (

        <div className="notifications-page">


            <div className="notifications-header">

                <div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Monitor system alerts and platform updates.
                    </p>

                </div>


                <button>
                    Mark All Read
                </button>


            </div>




            <div className="notifications-list">


                {
                    notifications.map(notification => (


                        <div
                            className="notification-card"
                            key={notification.id}
                        >


                            <div
                                className={
                                    notification.type === "success"
                                        ?
                                        "notification-icon success"
                                        :
                                        notification.type === "warning"
                                            ?
                                            "notification-icon warning"
                                            :
                                            "notification-icon error"
                                }
                            >


                                {
                                    notification.type === "success"
                                        ?
                                        <CheckCircle size={24} />
                                        :
                                        notification.type === "warning"
                                            ?
                                            <AlertTriangle size={24} />
                                            :
                                            <Bell size={24} />
                                }


                            </div>



                            <div className="notification-content">


                                <h3>
                                    {notification.title}
                                </h3>


                                <p>
                                    {notification.message}
                                </p>


                                <span>
                                    {notification.time}
                                </span>


                            </div>



                            <RefreshCcw
                                size={18}
                                className="refresh-icon"
                            />



                        </div>


                    ))

                }



            </div>



        </div>

    )

}


export default Notifications;