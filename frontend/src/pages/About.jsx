import "../styles/About.css";


const FEATURES = [

{ icon: "bi-building", title: "PG Management", text: "Manage multiple PG / hostel properties from a single dashboard." },
{ icon: "bi-people", title: "Resident Records", text: "Keep track of resident profiles, documents and stay history." },
{ icon: "bi-door-open", title: "Room & Allocation", text: "Monitor room occupancy and allocate beds to residents with ease." },
{ icon: "bi-cash", title: "Rent & Billing", text: "Generate rent, bills and track payments without spreadsheets." },
{ icon: "bi-box-arrow-in-right", title: "Entry / Exit Tracking", text: "Log resident movement and visitor entries for better security." },
{ icon: "bi-chat-left-text", title: "Complaints", text: "Raise, track and resolve resident complaints quickly." },
{ icon: "bi-bell", title: "Notifications", text: "Send timely reminders and updates to residents and staff." },
{ icon: "bi-file-earmark-bar-graph", title: "Reports", text: "Get insights into occupancy, revenue and resident trends." },

];


const STACK = [

{ label: "Frontend", value: "React + Vite" },
{ label: "Backend", value: "FastAPI (Python)" },
{ label: "Database", value: "SQL Database" },
{ label: "Auth", value: "JWT based authentication" },

];


export default function About(){


return(

<div className="about-page">


<div className="about-header">

<h1>
About
</h1>

<p>
Everything you need to know about this PG Management System
</p>

</div>




{/* APP INTRO */}

<div className="about-card about-hero">

<div className="about-hero-icon">
<i className="bi bi-building"></i>
</div>

<div>

<h2>
PG Management System
</h2>

<p>
A complete solution to manage Paying Guest &amp; hostel operations —
residents, rooms, rent, payments, complaints and more — all from
one clean dashboard.
</p>

<span className="about-version">
Version 1.0.0
</span>

</div>

</div>




{/* FEATURES */}

<div className="about-card">

<div className="about-title">
<i className="bi bi-stars"></i>
<div>
<h3>
Key Features
</h3>
<p>
What you can do with this platform
</p>
</div>
</div>


<div className="about-features-grid">

{FEATURES.map((f,i)=>(

<div className="about-feature" key={i}>

<div className="about-feature-icon">
<i className={`bi ${f.icon}`}></i>
</div>

<div>
<h4>{f.title}</h4>
<p>{f.text}</p>
</div>

</div>

))}

</div>

</div>




{/* TECH STACK */}

<div className="about-card">

<div className="about-title">
<i className="bi bi-cpu"></i>
<div>
<h3>
Built With
</h3>
<p>
Technologies powering this application
</p>
</div>
</div>


<div className="about-stack-grid">

{STACK.map((s,i)=>(

<div className="about-stack-item" key={i}>
<span className="about-stack-label">{s.label}</span>
<span className="about-stack-value">{s.value}</span>
</div>

))}

</div>

</div>




{/* SUPPORT */}

<div className="about-card about-support">

<div className="about-title">
<i className="bi bi-life-preserver"></i>
<div>
<h3>
Support &amp; Contact
</h3>
<p>
Need help or want to report an issue?
</p>
</div>
</div>

<p className="about-support-text">
Reach out to your system administrator, or contact the support team
at <a href="mailto:support@pgmanagement.com">support@pgmanagement.com</a>
</p>

</div>


</div>

)}
