import {useEffect, useState} from "react";
import api from "../api/axios";
import "../styles/Complaint.css";


function Complaint(){

const [complaints,setComplaints]=useState([]);


const [formData,setFormData]=useState({

resident_id:"",
title:"",
description:""

});



const loadComplaints=async()=>{

try{

const res=await api.get("/complaint/list");

setComplaints(res.data);

}
catch(err){

console.log(err);

}

};



useEffect(()=>{

loadComplaints();

},[]);




const change=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};





const createComplaint=async(e)=>{

e.preventDefault();


try{

const res=await api.post(

"/complaint/create",

{

resident_id:Number(formData.resident_id),

title:formData.title,

description:formData.description

}

);


alert(
res.data.message ||
"Complaint created"
);



setFormData({

resident_id:"",
title:"",
description:""

});


loadComplaints();


}

catch(err){

alert(

err.response?.data?.detail ||

"Failed to create complaint"

);

}


};






const updateStatus=async(id)=>{


try{


await api.put(

`/complaint/status/${id}`,

{

status:"Solved"

}

);


loadComplaints();


}

catch(err){

console.log(err);

}


};







return(

<div className="complaint-ui-page">



{/* HEADER */}

<div className="complaint-ui-header">


<div>

<h1>
Complaints
</h1>

<p>
Track and resolve resident issues
</p>

</div>



<div className="complaint-ui-icon">

<i className="bi bi-chat-left-text"></i>

</div>


</div>








{/* CREATE */}


<div className="complaint-ui-card">


<div className="complaint-ui-title">

<i className="bi bi-plus-circle"></i>

<div>

<h3>
Create Complaint
</h3>

<p>
Register resident complaints
</p>

</div>

</div>






<form onSubmit={createComplaint}>


<div className="complaint-ui-form">



<input

name="resident_id"

placeholder="Resident ID"

value={formData.resident_id}

onChange={change}

/>





<input

name="title"

placeholder="Complaint Title"

value={formData.title}

onChange={change}

/>






<textarea

name="description"

placeholder="Complaint Description"

value={formData.description}

onChange={change}

/>



</div>





<button className="complaint-ui-primary">

<i className="bi bi-check-circle"></i>

Create Complaint

</button>



</form>



</div>










{/* LIST */}


<div className="complaint-ui-card">


<div className="complaint-ui-title">

<i className="bi bi-list-check"></i>

<div>

<h3>
All Complaints
</h3>

<p>
View and manage resident complaints
</p>

</div>

</div>





<div className="complaint-table-wrapper">


<table className="complaint-table">


<thead>

<tr>

<th>
Complaint ID
</th>

<th>
Resident ID
</th>

<th>
Title
</th>

<th>
Description
</th>

<th>
Status
</th>

<th>
Action
</th>

</tr>

</thead>





<tbody>


{

complaints.length > 0 ?


complaints.map((c)=>(


<tr key={c.id}>


<td>
#{c.id}
</td>



<td>
#{c.resident_id}
</td>




<td>

<div className="complaint-name">

<i className="bi bi-chat-left-text"></i>

{c.title}

</div>

</td>





<td className="complaint-description">

{c.description}

</td>






<td>


<span

className={

c.status==="Solved"

?

"complaint-solved"

:

"complaint-pending"

}

>


{c.status}


</span>


</td>







<td>


{

c.status!=="Solved" &&


<button

className="complaint-solve"

onClick={()=>updateStatus(c.id)}

>


<i className="bi bi-check"></i>

Solve


</button>


}



{

c.status==="Solved" &&


<span className="complaint-done">

Completed

</span>


}



</td>





</tr>


))


:


<tr>

<td

colSpan="6"

className="complaint-empty"

>

No complaints found

</td>

</tr>


}



</tbody>


</table>


</div>




</div>






</div>


)

}



export default Complaint;