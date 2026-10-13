import {useState} from "react";
import api from "../api/axios";
import "../styles/Notification.css";


function Notification(){


const [notification,setNotification]=useState({

subject:"",
message:""

});


const [sending,setSending]=useState(false);



const change=(e)=>{


setNotification({

...notification,

[e.target.name]:e.target.value

});


};





const sendNotification=async()=>{


if(
!notification.subject ||
!notification.message
){

alert("Please fill all fields");

return;

}



try{


setSending(true);



const res=

await api.post(

"/notification/send",

notification

);



alert(

res.data.message ||

"Notification sent"

);



setNotification({

subject:"",
message:""

});


}

catch(err){


console.log(err);


alert(

err.response?.data?.detail ||

"Failed to send notification"

);


}


finally{


setSending(false);


}


};





return(


<div className="notification-page">





<div className="notification-header">


<div>

<h1>

Notifications

</h1>


<p>

Send important updates to residents

</p>


</div>



<div className="notification-icon">

<i className="bi bi-bell"></i>

</div>


</div>







<div className="notification-card">



<div className="card-title">


<i className="bi bi-send"></i>


<div>

<h3>

Send Notification

</h3>


<p>

Create and send a message to residents

</p>


</div>


</div>








<div className="notification-form">



<label>

Subject

</label>


<input

name="subject"

placeholder="Enter notification subject"

value={notification.subject}

onChange={change}

/>





<label>

Message

</label>


<textarea

name="message"

rows="7"

placeholder="Write your message here..."

value={notification.message}

onChange={change}

/>



<button

className="send-btn"

onClick={sendNotification}

disabled={sending}

>


<i className="bi bi-send-fill"></i>


{

sending ?

"Sending..." :

"Send Notification"

}


</button>




</div>




</div>







<div className="notification-card preview-card">


<div className="card-title">


<i className="bi bi-eye"></i>


<div>

<h3>

Preview

</h3>


<p>

See how your notification will look

</p>


</div>


</div>





<div className="preview-box">


<h4>

{

notification.subject ||

"No subject"

}

</h4>


<p>

{

notification.message ||

"Your message will appear here"

}

</p>


</div>




</div>







</div>


)

}


export default Notification;