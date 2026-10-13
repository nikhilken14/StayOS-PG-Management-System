import {useEffect,useState} from "react";
import api from "../api/axios";
import "../styles/Rent.css";


function Rent(){

const [collection,setCollection]=useState({
 expected_rent:0,
 collected:0,
 pending:0
});


const [generate,setGenerate]=useState({
 month:"",
 year:""
});


const [residentId,setResidentId]=useState("");
const [rentId,setRentId]=useState("");

const [due,setDue]=useState(null);
const [history,setHistory]=useState([]);
const [status,setStatus]=useState(null);



useEffect(()=>{

loadCollection();

},[]);



const loadCollection=async()=>{

try{

const res=await api.get("/rent/collection");

setCollection(res.data);

}
catch(err){

console.log(err);

}

};




const generateRent=async(e)=>{

e.preventDefault();

try{

const res=await api.post("/rent/generate",{

month:Number(generate.month),
year:Number(generate.year)

});


alert(res.data.message);

setGenerate({
month:"",
year:""
});


loadCollection();


}
catch(err){

alert(
err.response?.data?.detail ||
"Generate failed"
);

}

};





const getDue=async()=>{

try{

const res=await api.get(
`/rent/due/${residentId}`
);

setDue(res.data);

}

catch(err){

console.log(err);

}

};





const getHistory=async()=>{

try{

const res=await api.get(
`/rent/history/${residentId}`
);

setHistory(res.data);

}

catch(err){

console.log(err);

}

};






const getStatus=async()=>{


try{

const res=await api.get(
`/rent/status/${rentId}`
);

setStatus(res.data);

}

catch(err){

console.log(err);

}


};





return(

<div className="rent-container">


<div className="rent-header">

<h1>
Rent Management
</h1>

<p>
Generate rent and monitor collections
</p>

</div>






<div className="rent-stats">


<div className="rent-stat-card">

<span>
Expected Rent
</span>

<h2>
₹ {collection.expected_rent}
</h2>

</div>



<div className="rent-stat-card">

<span>
Collected
</span>

<h2 className="green-text">
₹ {collection.collected}
</h2>

</div>



<div className="rent-stat-card">

<span>
Pending
</span>

<h2 className="red-text">
₹ {collection.pending}
</h2>

</div>


</div>









<div className="rent-card">


<h2>
Generate Monthly Rent
</h2>


<form
onSubmit={generateRent}
className="rent-form"
>


<input
type="number"
placeholder="Month"
value={generate.month}
onChange={(e)=>
setGenerate({
...generate,
month:e.target.value
})
}
/>


<input
type="number"
placeholder="Year"
value={generate.year}
onChange={(e)=>
setGenerate({
...generate,
year:e.target.value
})
}
/>


<button>
Generate
</button>


</form>


</div>








<div className="rent-card">


<h2>
Resident Due & History
</h2>


<div className="rent-search">


<input

placeholder="Resident ID"

value={residentId}

onChange={(e)=>
setResidentId(e.target.value)
}

/>



<button onClick={getDue}>
Check Due
</button>



<button 
className="secondary"
onClick={getHistory}
>
History
</button>


</div>





{
due &&

<div className="rent-result">

<h3>
Total Due
</h3>

<h1>
₹ {due.total_due}
</h1>

</div>

}



</div>








<div className="rent-card">


<h2>
Rent Status
</h2>


<div className="rent-search">


<input

placeholder="Rent ID"

value={rentId}

onChange={(e)=>
setRentId(e.target.value)
}

/>



<button onClick={getStatus}>
Check
</button>


</div>




{
status &&

<div className="rent-result">


<p>
Resident : {status.resident_id}
</p>

<p>
Amount : ₹ {status.rent_amount}
</p>

<p>
Paid : ₹ {status.paid_amount}
</p>

<p>
Due : ₹ {status.due_amount}
</p>


<h3>

{status.status}

</h3>


</div>


}



</div>
<div className="rent-card">

<h2 className="rent-title">
    Rent History
</h2>

<div className="rent-table-wrapper">

    <table className="rent-table">

        <thead>

            <tr>
                <th>Rent ID</th>
                <th>Month</th>
                <th>Year</th>
                <th>Rent Amount</th>
                <th>Paid Amount</th>
                <th>Due Amount</th>
                <th>Status</th>
            </tr>

        </thead>

        <tbody>

            {history.length > 0 ? (

                history.map((item) => (

                    <tr key={item.rent_id}>

                        <td>#{item.rent_id}</td>

                        <td>{item.month}</td>

                        <td>{item.year}</td>

                        <td>₹ {item.rent_amount}</td>

                        <td className="green-text">
                            ₹ {item.paid_amount}
                        </td>

                        <td className="red-text">
                            ₹ {item.due_amount}
                        </td>

                        <td>

                            <span
                                className={
                                    item.due_amount > 0
                                        ? "rent-pending"
                                        : "rent-paid"
                                }
                            >
                                {item.due_amount > 0
                                    ? "Pending"
                                    : "Paid"}
                            </span>

                        </td>

                    </tr>

                ))

            ) : (

                <tr>

                    <td
                        colSpan="7"
                        className="rent-empty"
                    >
                        Search a resident and click
                        "History" to load rent records
                    </td>

                </tr>

            )}

        </tbody>

    </table>

</div>
</div>



</div>


)

}


export default Rent;