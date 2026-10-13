import {useEffect, useState} from "react";
import api from "../api/axios";
import "../styles/ResidentMovement.css";


export default function ResidentMovement(){


const [status,setStatus]=useState({

inside_count:0,
outside_count:0,
inside:[],
outside:[]

});


const [residentId,setResidentId]=useState("");

const [history,setHistory]=useState([]);

const [today,setToday]=useState([]);

const [message,setMessage]=useState("");

const [loading,setLoading]=useState(false);





const loadStatus=async()=>{

try{

const res=await api.get(
"/residentmovement/status"
);

setStatus(res.data);

}

catch(err){

console.log(err);

}

};







const loadToday=async()=>{

try{

const res=await api.get(
"/residentmovement/today"
);

setToday(res.data);

}

catch(err){

console.log(err);

}

};







useEffect(()=>{

loadStatus();

loadToday();

},[]);








const updateMovement=async(type)=>{


if(!residentId){

setMessage(
"Enter Resident ID"
);

return;

}



try{


setLoading(true);



const res=await api.post(

`/residentmovement/${type}`,

{

resident_id:Number(residentId)

}

);



setMessage(

res.data.message ||

type==="entry"

?

"Resident entry recorded"

:

"Resident exit recorded"

);



loadStatus();

loadToday();


}

catch(err){

setMessage(

err.response?.data?.detail ||

"Operation failed"

);


}

finally{

setLoading(false);

}


};









const getHistory=async()=>{


if(!residentId){

alert("Enter Resident ID");

return;

}



try{


const res=await api.get(

`/residentmovement/history/${residentId}`

);



setHistory(res.data);


}

catch(err){

console.log(err);

}


};









return(


<div className="resident-page">





{/* HEADER */}


<div className="resident-header">


<div>


<h1>
Resident Movement
</h1>


<p>
Track resident entry and exit activity
</p>


</div>



<div className="resident-icon">

<i className="bi bi-door-open"></i>

</div>


</div>









{/* STATS */}


<div className="movement-stats">



<div className="movement-stat">

<h2>
{status.inside_count}
</h2>

<p>
Currently Inside
</p>

</div>





<div className="movement-stat">

<h2>
{status.outside_count}
</h2>

<p>
Outside
</p>

</div>



</div>









{/* ENTRY EXIT */}



<div className="movement-card">


<h2>
Entry / Exit Management
</h2>




<input

className="movement-input"

placeholder="Resident ID"

value={residentId}

onChange={(e)=>
setResidentId(e.target.value)
}

/>





<div className="movement-buttons">



<button

className="entry-btn"

disabled={loading}

onClick={()=>
updateMovement("entry")
}

>

<i className="bi bi-box-arrow-in-right"></i>

  <h4>Entry</h4>

</button>






<button

className="exit-btn"

disabled={loading}

onClick={()=>
updateMovement("exit")
}

>

<i className="bi bi-box-arrow-right"></i>

 <h4>Exit</h4>

</button>



</div>





{

message &&

<div className="movement-message">

{message}

</div>

}



</div>









{/* HISTORY */}



<div className="movement-card">



<div className="card-head">


<h2>
Resident History
</h2>



<button

className="primary-btn"

onClick={getHistory}

>

Load History

</button>



</div>








<div className="movement-table-wrapper">


<table className="movement-table">


<thead>

<tr>

<th>
Movement ID
</th>


<th>
Resident ID
</th>


<th>
Entry Time
</th>


<th>
Exit Time
</th>


<th>
Status
</th>


</tr>

</thead>





<tbody>



{

history.length>0


?


history.map((item)=>(


<tr key={item.id}>


<td>
#{item.id}
</td>


<td>
#{item.resident_id}
</td>


<td>
{item.entry_time || "-"}
</td>


<td>
{item.exit_time || "-"}
</td>


<td>


<span

className={

item.status==="Inside"

?

"movement-inside"

:

"movement-outside"

}

>

{item.status}

</span>


</td>



</tr>



))



:


<tr>

<td

colSpan="5"

className="movement-empty"

>

No history found

</td>

</tr>


}



</tbody>


</table>


</div>



</div>









{/* TODAY MOVEMENT */}



<div className="movement-card">


<h2>
Today's Movement
</h2>





<div className="movement-table-wrapper">


<table className="movement-table">


<thead>


<tr>


<th>
Movement ID
</th>


<th>
Resident ID
</th>


<th>
Status
</th>


</tr>


</thead>






<tbody>


{

today.length>0


?


today.map((item)=>(


<tr key={item.id}>


<td>
#{item.id}
</td>


<td>
#{item.resident_id}
</td>


<td>


<span

className={

item.status==="Inside"

?

"movement-inside"

:

"movement-outside"

}

>

{item.status}

</span>


</td>


</tr>


))


:


<tr>

<td

colSpan="3"

className="movement-empty"

>

No movement recorded today

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