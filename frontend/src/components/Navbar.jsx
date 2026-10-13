import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CalendarPopup from "./CalendarPopup";
import { currentProfile } from "../auth";
export default function Navbar({toggleSidebar}){
 const [calendar,setCalendar]=useState(false), [search,setSearch]=useState("");
 const {pathname}=useLocation();const profile=currentProfile();
 const labels={home:"Overview",pg:"Properties",team:"Team & access",residentmovement:"Entry & exit"};
 const title=labels[pathname.split("/")[1]]||pathname.slice(1).replace(/(^.|-.)/g,x=>x.toUpperCase());
 return <header className="navbar"><div className="navbar-context"><button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle navigation"><i className="bi bi-list"/></button><div><span className="nav-eyebrow">YOUR WORKSPACE / {title.toUpperCase()}</span><strong>{title}</strong></div></div><div className="navbar-right"><form className="global-search" onSubmit={e=>{e.preventDefault();if(search.trim())window.location.assign(`/residents?q=${encodeURIComponent(search)}`)}}><i className="bi bi-search"/><input aria-label="Search residents" placeholder="Search residents..." value={search} onChange={e=>setSearch(e.target.value)}/><kbd>↵</kbd></form><button className="calendar-btn" onClick={()=>setCalendar(v=>!v)} title="Calendar"><i className="bi bi-calendar3"/><span>Calendar</span></button><span className="role-chip">{profile?.role||"USER"}</span><Link className="nav-avatar" to="/account" aria-label="Account">{(profile?.full_name||profile?.username||"U").slice(0,1).toUpperCase()}</Link></div>{calendar&&<div className="calendar-dropdown"><CalendarPopup/></div>}</header>
}
