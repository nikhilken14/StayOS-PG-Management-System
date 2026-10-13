import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Visitor.css";


function Visitor(){


const [formData,setFormData]=useState({

name:"",
phone:"",
reason:"",
visiting:""

});


const [visitors,setVisitors]=useState([]);

const [insideVisitors,setInsideVisitors]=useState([]);




const loadVisitors=async()=>{

try{

const res=await api.get("/visitor/list");

setVisitors(res.data);

}
catch(err){

console.log(err);

}

};




const loadInsideVisitors=async()=>{

try{

const res=await api.get("/visitor/inside");

setInsideVisitors(res.data);

}
catch(err){

console.log(err);

}

};




useEffect(()=>{

loadVisitors();

loadInsideVisitors();

},[]);





const handleChange=(e)=>{


setFormData({

...formData,

[e.target.name]:e.target.value

});


};






const checkInVisitor=async(e)=>{


e.preventDefault();


try{


const res=await api.post(

"/visitor/check-in",

formData

);



alert(res.data.message);



setFormData({

name:"",
phone:"",
reason:"",
visiting:""

});


loadVisitors();

loadInsideVisitors();


}

catch(err){

alert("Check-in failed");

}


};







const checkoutVisitor=async(phone)=>{


try{


const res=await api.put(

"/visitor/check-out",

{phone}

);



alert(res.data.message);


loadVisitors();

loadInsideVisitors();


}

catch(err){


alert(

err.response?.data?.detail ||

"Checkout failed"

);


}

};






return(


<div className="visitor-page">





<div className="visitor-header">


<div>

<h1>

Visitor Management

</h1>


<p>

Manage visitor check-ins and check-outs

</p>


</div>



<div className="visitor-icon">

<i className="bi bi-person-badge"></i>

</div>


</div>








{/* CHECK IN */}


<div className="visitor-card">


<div className="visitor-title">


<i className="bi bi-box-arrow-in-right"></i>


<div>

<h3>

Visitor Check-In

</h3>


<p>
Register a new visitor entry
</p>


</div>


</div>






<form onSubmit={checkInVisitor}>


<div className="visitor-form">


<input

name="name"

placeholder="Visitor Name"

value={formData.name}

onChange={handleChange}

/>



<input

name="phone"

placeholder="Phone Number"

value={formData.phone}

onChange={handleChange}

/>



<input

name="visiting"

placeholder="Resident / Room"

value={formData.visiting}

onChange={handleChange}

/>



<input

name="reason"

placeholder="Reason for visit"

value={formData.reason}

onChange={handleChange}

/>


</div>





<button className="visitor-primary-btn">


<i className="bi bi-check-circle"></i>

Check In Visitor


</button>


</form>


</div>











{/* INSIDE */}


<div className="visitor-section">


<h2>

<i className="bi bi-people-fill"></i>

Currently Inside

</h2>



<div className="visitor-table-card">


<table className="visitor-table">


<thead>

<tr>

<th>Name</th>

<th>Phone</th>

<th>Visiting</th>

<th>Reason</th>

<th>Action</th>

</tr>

</thead>



<tbody>


{

insideVisitors.map(visitor=>(


<tr key={visitor.id}>


<td>

{visitor.name}

</td>



<td>

{visitor.phone}

</td>



<td>

{visitor.visiting}

</td>



<td>

{visitor.reason}

</td>



<td>


<button

className="checkout-btn"

onClick={()=>checkoutVisitor(visitor.phone)}

>


<i className="bi bi-box-arrow-right"></i>

Check Out


</button>


</td>



</tr>


))


}



</tbody>



</table>


</div>


</div>



{/* HISTORY */}


<div className="visitor-section">


<h2>

<i className="bi bi-clock-history"></i>

Visitor History

</h2>



<div className="visitor-table-card">


<table className="visitor-table">


<thead>

<tr>

<th>Name</th>

<th>Phone</th>

<th>Visiting</th>

<th>Reason</th>

<th>Status</th>

<th>Check In</th>

<th>Check Out</th>


</tr>

</thead>



<tbody>


{

visitors.map(visitor=>(


<tr key={visitor.id}>


<td>

{visitor.name}

</td>



<td>

{visitor.phone}

</td>



<td>

{visitor.visiting}

</td>



<td>

{visitor.reason}

</td>



<td>


<span

className={

visitor.status==="inside"

?

"visitor-inside"

:

"visitor-left"

}

>


{

visitor.status==="inside"

?

"Inside"

:

"Left"

}


</span>


</td>



<td>

{visitor.check_in}

</td>



<td>

{

visitor.check_out ||

"-"

}

</td>



</tr>


))


}



</tbody>



</table>


</div>



</div>






</div>


)

}


export default Visitor;