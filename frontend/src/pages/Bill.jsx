import {useEffect, useState} from "react";
import api from "../api/axios";
import "../styles/Bill.css";


export default function Bill(){


const [summary,setSummary]=useState({

total:0,
electricity:0,
water:0,
wifi:0,
maintenance:0

});


const [bills,setBills]=useState([]);



const [form,setForm]=useState({

pg_id:"",
bill_type:"",
bill_amount:"",
bill_date:""

});





const loadData=async()=>{


try{


const [
summaryRes,
listRes

]=await Promise.all([

api.get("/bill/total"),

api.get("/bill/list")

]);



setSummary(summaryRes.data);

setBills(listRes.data);


}

catch(err){

console.log(err);

}


};






useEffect(()=>{

loadData();

},[]);







const change=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};








const uploadBill=async(e)=>{


e.preventDefault();


try{


const res=await api.post(

"/bill/upload",

{

pg_id:Number(form.pg_id),

bill_type:form.bill_type,

bill_amount:Number(form.bill_amount),

bill_date:form.bill_date

}

);



alert(
res.data.message ||
"Bill uploaded"
);



setForm({

pg_id:"",
bill_type:"",
bill_amount:"",
bill_date:""

});


loadData();


}

catch(err){


alert(

err.response?.data?.detail ||

"Bill upload failed"

);


}


};







return(


<div className="bill-ui-page">





{/* HEADER */}


<div className="bill-ui-header">


<div>

<h1>
Bill Management
</h1>


<p>
Manage PG expenses and bill records
</p>


</div>



<div className="bill-ui-icon">

<i className="bi bi-receipt"></i>

</div>


</div>










{/* SUMMARY */}


<div className="bill-ui-summary">



<Card

title="Total Bills"

value={`₹ ${summary.total}`}

icon="bi-currency-rupee"

/>


<Card

title="Electricity"

value={`₹ ${summary.electricity}`}

icon="bi-lightning"

/>



<Card

title="Water"

value={`₹ ${summary.water}`}

icon="bi-droplet"

/>




<Card

title="Wifi"

value={`₹ ${summary.wifi}`}

icon="bi-wifi"

/>




<Card

title="Maintenance"

value={`₹ ${summary.maintenance}`}

icon="bi-tools"

/>



</div>










{/* UPLOAD */}


<div className="bill-ui-card">



<div className="bill-ui-title">


<i className="bi bi-upload"></i>


<div>

<h3>
Upload Bill
</h3>

<p>
Add new PG bill record
</p>


</div>


</div>






<form onSubmit={uploadBill}>


<div className="bill-ui-form">



<input

name="pg_id"

placeholder="PG ID"

value={form.pg_id}

onChange={change}

/>




<select

name="bill_type"

value={form.bill_type}

onChange={change}

>


<option value="">
Select Bill Type
</option>

<option>
Electricity
</option>

<option>
Water
</option>

<option>
Wifi
</option>

<option>
Maintenance
</option>


</select>







<input

name="bill_amount"

type="number"

placeholder="Bill Amount"

value={form.bill_amount}

onChange={change}

/>






<input

type="date"

name="bill_date"

value={form.bill_date}

onChange={change}

/>




</div>






<button className="bill-ui-primary">

<i className="bi bi-check-circle"></i>

Upload Bill

</button>




</form>


</div>













{/* LIST */}



<div className="bill-ui-card">


<h2>
Bill History
</h2>



<div className="bill-ui-table-wrapper">


<table>


<thead>

<tr>

<th>
ID
</th>

<th>
PG
</th>

<th>
Type
</th>

<th>
Amount
</th>

<th>
Date
</th>


</tr>


</thead>



<tbody>


{

bills.map((bill)=>(


<tr key={bill.id}>


<td>
#{bill.id}
</td>


<td>
{bill.pg_id}
</td>


<td>

<span className="bill-ui-badge">

{bill.bill_type}

</span>

</td>


<td>
₹ {bill.bill_amount}
</td>


<td>
{bill.bill_date}
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









function Card({title,value,icon}){


return(


<div className="bill-ui-stat">


<div className="bill-ui-stat-icon">

<i className={`bi ${icon}`}></i>

</div>


<div>

<p>
{title}
</p>


<h2>
{value}
</h2>


</div>


</div>


)

}