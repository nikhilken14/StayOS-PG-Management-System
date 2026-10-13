import {useState} from "react";
import api from "../api/axios";
import "../styles/Report.css";


function Report(){


const currentYear = new Date().getFullYear();


const [year,setYear]=useState(currentYear);

const [month,setMonth]=useState(1);


const [type,setType]=useState("yearly");


const [report,setReport]=useState(null);





const loadReport=async()=>{


try{


let url="";


if(type==="yearly"){

url=`/report/yearly/${year}`;

}

else{

url=`/report/monthly/${year}/${month}`;

}



const res=await api.get(url);


setReport(res.data);



}

catch(err){

console.log(err);

alert(
"Failed to load report"
);

}


};






const downloadPdf=async()=>{
  const url=type==="yearly"?`/report/yearly/${year}/pdf`:`/report/monthly/${year}/${month}/pdf`;
  try {
    const res=await api.get(url,{responseType:"blob"});
    const blob=new Blob([res.data],{type:"application/pdf"});
    const objectUrl=URL.createObjectURL(blob);
    const link=document.createElement("a");link.href=objectUrl;link.download=`stayos-${type}-${year}.pdf`;
    document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),5000);
  }catch(error){alert(error.response?.data?.detail||"Could not download report")}
};





return(


<div className="report-page">





<div className="report-header">


<div>

<h1>
Reports
</h1>


<p>
View monthly and yearly PG performance
</p>


</div>



<div className="report-icon">

<i className="bi bi-bar-chart-line"></i>

</div>


</div>









{/* FILTER */}



<div className="report-card">


<div className="section-title">


<i className="bi bi-calendar"></i>


<div>

<h3>
Generate Report
</h3>

<p>
Choose report type and period
</p>


</div>


</div>






<div className="report-actions">



<select

value={type}

onChange={(e)=>{

setType(e.target.value);

setReport(null);

}}

>


<option value="yearly">

Yearly

</option>


<option value="monthly">

Monthly

</option>


</select>






<input

type="number"

value={year}

onChange={(e)=>
setYear(e.target.value)
}

/>





{

type==="monthly" &&

<select

value={month}

onChange={(e)=>
setMonth(e.target.value)
}

>


{

Array.from(
{length:12},
(_,i)=>i+1
)
.map(m=>(

<option key={m}
value={m}
>

Month {m}

</option>

))

}


</select>


}







<button

className="generate-btn"

onClick={loadReport}

>

<i className="bi bi-search"></i>

Generate

</button>






<button

className="download-btn"

onClick={downloadPdf}

>

<i className="bi bi-file-earmark-pdf"></i>

PDF

</button>




</div>


</div>









{
report &&

<>





{/* SUMMARY */}


<div className="summary-grid">



<Summary

icon="bi-buildings"

title="Total PGs"

value={report.total_pgs}

/>



<Summary

icon="bi-door-open"

title="Total Rooms"

value={report.total_rooms}

/>



<Summary

icon="bi-people"

title="Residents"

value={report.total_residents}

/>



<Summary

icon="bi-person-check"

title="Occupied Beds"

value={report.occupied_beds}

/>



</div>









{/* COLLECTION */}



<div className="collection-card">


<p>

Total Collection

</p>


<h1>

₹ {report.total_collection}

</h1>


<span>

Revenue generated

</span>


</div>











{/* BILL BREAKDOWN */}


{

report.bill_breakdown &&


<div className="report-card">


<h3>
Bill Breakdown
</h3>


<div className="bill-grid">


{

Object.entries(
report.bill_breakdown
)
.map(([key,value])=>(


<div

className="bill-card"

key={key}

>


<h4>
{key}
</h4>


<p>
₹ {value}
</p>


</div>


))


}



</div>


</div>


}









{/* COMPLAINT */}



{

report.total_complaints!==undefined &&


<div className="report-card complaint-card">


<i className="bi bi-chat"></i>


<div>


<p>
Total Complaints
</p>


<h1>

{report.total_complaints}

</h1>


</div>


</div>


}









{/* MONTHLY COLLECTION TABLE */}



{

report.monthly_collection &&


<div className="report-card">


<h3>

Monthly Collection

</h3>





<table className="report-table">


<thead>

<tr>

<th>
Month
</th>


<th>
Amount
</th>


</tr>

</thead>



<tbody>


{

report.monthly_collection.map(item=>(


<tr key={item.month}>


<td>
{item.month}
</td>


<td>
₹ {item.amount}
</td>


</tr>


))


}


</tbody>


</table>



</div>


}





</>


}



</div>


)

}









function Summary({icon,title,value}){


return(


<div className="summary-card">


<i className={`bi ${icon}`}></i>


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



export default Report;