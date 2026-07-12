import "./Settings.css";
import {
    Globe,
    Store,
    Bell,
    Shield,
    User
} from "lucide-react";


const settingsData = [

    {
        title:"Website Settings",
        description:"Manage website information and basic configuration.",
        icon:<Globe size={25}/>,
        options:[
            "Website Name",
            "Logo Management",
            "Contact Information"
        ]
    },


    {
        title:"Store Management",
        description:"Manage connected shopping platforms.",
        icon:<Store size={25}/>,
        options:[
            "Connected Stores",
            "API Connections",
            "Price Sync Settings"
        ]
    },


    {
        title:"Notification Settings",
        description:"Control system alerts and updates.",
        icon:<Bell size={25}/>,
        options:[
            "Price Update Alerts",
            "Sync Failure Alerts",
            "Admin Notifications"
        ]
    },


    {
        title:"Security",
        description:"Manage admin account security.",
        icon:<Shield size={25}/>,
        options:[
            "Change Password",
            "Two Factor Authentication",
            "Login Activity"
        ]
    }

];



const Settings = () => {


return (

<div className="settings-page">


<div className="settings-header">

<div>

<h1>
Settings
</h1>

<p>
Manage PPC platform configuration and preferences.
</p>

</div>


</div>




<div className="settings-grid">


{
settingsData.map(setting=>(


<div 
className="setting-card"
key={setting.title}
>


<div className="setting-top">


<div className="setting-icon">

{setting.icon}

</div>


<div>

<h2>
{setting.title}
</h2>

<p>
{setting.description}
</p>

</div>


</div>




<div className="setting-options">


{
setting.options.map(option=>(


<div
className="setting-option"
key={option}
>

<User size={16}/>

<span>
{option}
</span>


</div>


))

}


</div>



</div>


))

}



</div>



</div>

)

}


export default Settings;