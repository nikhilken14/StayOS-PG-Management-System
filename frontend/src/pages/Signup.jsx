import {
useState
} from "react";

import api from "../api/axios";

import {
useNavigate,
Link
} from "react-router-dom";

import "../styles/Signup.css";


export default function Signup(){


const navigate = useNavigate();


const [form,setForm]=useState({

username:"",
email:"",
password:"",
security_question:"",
security_answer:""

});



const change=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};





const submit=async(e)=>{

e.preventDefault();


try{


const res=await api.post(
"/auth/signup",
form
);


alert(
res.data.message ||
"Account created"
);


navigate("/");


}

catch(err){


alert(

err.response?.data?.detail ||

"Signup failed"

);


}


};





return(


<div className="signup-page">



<div className="signup-card">



<div className="signup-brand">

<div className="brand-icon">
🏢
</div>


<h2>
StayOS
</h2>

</div>





<h1>
Create Owner Account
</h1>


<p className="signup-subtitle">

Register as a property owner to create your workspace. Only owners can invite administrators.

</p>





<form onSubmit={submit}>


<div className="signup-grid">



<div className="signup-field">

<label>
Username
</label>

<input

name="username"

placeholder="Enter username"

value={form.username}

onChange={change}

/>

</div>






<div className="signup-field">

<label>
Email
</label>

<input

type="email"

name="email"

placeholder="owner@example.com"

value={form.email}

onChange={change}

/>

</div>







<div className="signup-field">

<label>
Password
</label>

<input

type="password"

name="password"

placeholder="Create password"

value={form.password}

onChange={change}

/>

</div>







<div className="signup-field">

<label>
Security Question
</label>


<input

name="security_question"

placeholder="Your first pet name?"

value={form.security_question}

onChange={change}

/>


</div>







<div className="signup-field full">

<label>
Security Answer
</label>


<input

name="security_answer"

placeholder="Enter answer"

value={form.security_answer}

onChange={change}

/>


</div>



</div>







<button className="signup-button">

Create Owner Workspace

</button>




</form>







<div className="signup-footer">


<p>

Already have an account?

<Link to="/">

 Login

</Link>


</p>


</div>







</div>


</div>


)


}