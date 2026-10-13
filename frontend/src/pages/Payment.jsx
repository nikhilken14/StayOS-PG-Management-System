import { useState } from "react";
import api from "../api/axios";
import "../styles/Payment.css";


function Payment(){


const [formData,setFormData]=useState({

    resident_id:"",
    rent_id:"",
    amount_paid:"",
    pay_date:""

});


const [statusRentId,setStatusRentId]=useState("");

const [dueResidentId,setDueResidentId]=useState("");

const [status,setStatus]=useState(null);

const [due,setDue]=useState(null);





const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};






const recordPayment=async(e)=>{

e.preventDefault();


try{


const res=await api.post("/payment/",{

resident_id:Number(formData.resident_id),

rent_id:Number(formData.rent_id),

amount_paid:Number(formData.amount_paid),

pay_date:formData.pay_date

});



alert(res.data.message || "Payment Saved");



setFormData({

resident_id:"",
rent_id:"",
amount_paid:"",
pay_date:""

});


}

catch(err){

alert(

err.response?.data?.detail ||

"Payment Failed"

);

}


};









const getPaymentStatus=async()=>{


try{


const res=await api.get(

`/payment/status/${statusRentId}`

);


setStatus(res.data);


}

catch(err){

console.log(err);

}

};










const getDueRent=async()=>{


try{


const res=await api.get(

`/payment/due/${dueResidentId}`

);


setDue(res.data);


}

catch(err){

console.log(err);

}


};








return(


<div className="pay-page">





{/* HEADER */}


<div className="pay-header">


<div>

<h1>
Payment Management
</h1>

<p>
Manage payments and resident dues
</p>

</div>


<div className="pay-icon">

<i className="bi bi-cash-stack"></i>

</div>


</div>









{/* RECORD PAYMENT */}



<div className="pay-card">


<div className="pay-title">

<i className="bi bi-wallet"></i>


<div>

<h3>
Record Payment
</h3>


<p>
Save resident rent payment
</p>


</div>

</div>





<form onSubmit={recordPayment}>


<div className="pay-form">


<input

name="resident_id"

placeholder="Resident ID"

value={formData.resident_id}

onChange={handleChange}

/>



<input

name="rent_id"

placeholder="Rent ID"

value={formData.rent_id}

onChange={handleChange}

/>



<input

name="amount_paid"

placeholder="Amount Paid"

value={formData.amount_paid}

onChange={handleChange}

/>



<input

type="date"

name="pay_date"

value={formData.pay_date}

onChange={handleChange}

/>



</div>



<button className="pay-btn">

<i className="bi bi-check-circle"></i>

Save Payment

</button>



</form>



</div>









{/* PAYMENT STATUS */}



<div className="pay-card">


<div className="pay-title">


<i className="bi bi-info-circle"></i>


<div>

<h3>
Payment Status
</h3>


<p>
Check rent payment status
</p>


</div>


</div>






<div className="pay-search">


<input

placeholder="Enter Rent ID"

value={statusRentId}

onChange={(e)=>

setStatusRentId(e.target.value)

}


/>



<button

className="pay-btn"

onClick={getPaymentStatus}

>

Check Status

</button>


</div>







{

status &&


<div className="pay-result">


<p>
Rent ID
<strong>
{status.rent_id}
</strong>
</p>



<p>
Rent Amount
<strong>
₹ {status.rent_amount}
</strong>
</p>



<p>
Paid Amount
<strong className="pay-green">
₹ {status.paid_amount}
</strong>
</p>



<p>
Due Amount
<strong className="pay-red">
₹ {status.due_amount}
</strong>
</p>



<p>
Status

<span

className={

status.status==="Paid"

?

"paid"

:

"pending"

}

>

{status.status}

</span>


</p>



</div>


}



</div>









{/* CALCULATE DUE */}



<div className="pay-card">


<div className="pay-title">


<i className="bi bi-calculator"></i>


<div>

<h3>
Calculate Due Rent
</h3>


<p>
Check pending rent of resident
</p>


</div>


</div>






<div className="pay-search">


<input

placeholder="Enter Resident ID"

value={dueResidentId}

onChange={(e)=>

setDueResidentId(e.target.value)

}


/>



<button

className="pay-btn"

onClick={getDueRent}

>

Check Due

</button>


</div>







{

due &&


<div className="pay-total">


<h3>
Total Due
</h3>


<h1>
₹ {due.total_due}
</h1>


</div>


}



</div>









{/* DUE HISTORY TABLE */}



{

due &&


<div className="pay-card">


<h2>
Outstanding Rent Details
</h2>




<div className="pay-table-wrapper">


<table className="pay-table">


<thead>

<tr>

<th>
Month
</th>

<th>
Year
</th>

<th>
Rent
</th>

<th>
Paid
</th>

<th>
Due
</th>

</tr>

</thead>





<tbody>


{

due.rent_details.map((rent)=>(


<tr key={rent.rent_id}>


<td>
{rent.month}
</td>


<td>
{rent.year}
</td>


<td>
₹ {rent.rent_amount}
</td>


<td className="pay-green">
₹ {rent.paid_amount}
</td>


<td className="pay-red">
₹ {rent.due_amount}
</td>


</tr>


))


}


</tbody>


</table>


</div>


</div>


}





</div>


);


}


export default Payment;