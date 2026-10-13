import { NavLink, useNavigate } from "react-router-dom";
import { isOwner, currentProfile } from "../auth";
import "../styles/components.css";
const groups = [
  {title:"WORKSPACE",items:[{name:"Overview",path:"/home",icon:"bi-grid-1x2",roles:"both"},{name:"Properties",path:"/pg",icon:"bi-buildings",roles:"both"},{name:"Team & access",path:"/team",icon:"bi-person-gear",roles:"owner"},{name:"Rooms",path:"/rooms",icon:"bi-door-open",roles:"both"}]},
  {title:"OPERATIONS",items:[{name:"Residents",path:"/residents",icon:"bi-people",roles:"both"},{name:"Allocations",path:"/allocation",icon:"bi-diagram-3",roles:"both"},{name:"Entry & exit",path:"/residentmovement",icon:"bi-arrow-left-right",roles:"both"},{name:"Visitors",path:"/visitor",icon:"bi-person-check",roles:"both"},{name:"Complaints",path:"/complaint",icon:"bi-chat-left-text",roles:"both"},{name:"Notifications",path:"/notification",icon:"bi-bell",roles:"both"}]},
  {title:"FINANCE & INSIGHTS",items:[{name:"Rent",path:"/rent",icon:"bi-wallet2",roles:"both"},{name:"Payments",path:"/payment",icon:"bi-credit-card",roles:"both"},{name:"Bills",path:"/bill",icon:"bi-receipt",roles:"both"},{name:"Reports",path:"/report",icon:"bi-bar-chart-line",roles:"both"}]},
];
export default function Sidebar({open,onNavigate}) {
 const owner=isOwner();const user=currentProfile();const navigate=useNavigate();
 const signOut=()=>{localStorage.removeItem("access_token");localStorage.removeItem("stayos_user");onNavigate?.();navigate("/",{replace:true});};
 return <aside className={`sidebar ${open?"open":"close"}`}>
  <NavLink to="/home" className="sidebar-brand" onClick={onNavigate}><span className="brand-mark"><i className="bi bi-buildings-fill"/></span><span className="brand-name">StayOS<small>PROPERTY OPERATIONS</small></span></NavLink>
  <div className="workspace-label"><span className="workspace-initial">{(user?.full_name||"S").charAt(0).toUpperCase()}</span><span><strong>{owner?"My workspace":"Property workspace"}</strong><small>{owner?"Owner workspace":"Operations team"}</small></span><i className="bi bi-chevron-down"/></div>
  <nav className="sidebar-menu" aria-label="Main navigation">{groups.map(group=><div key={group.title} className="nav-group"><div className="nav-group-title">{group.title}</div>{group.items.filter(item=>item.roles==="both"||(owner&&item.roles==="owner")).map(item=><NavLink to={item.path} key={item.path} title={item.name} onClick={onNavigate} className={({isActive})=>isActive?"active":""}><i className={`bi ${item.icon}`}/><span>{item.name}</span></NavLink>)}</div>)}</nav>
  <div className="sidebar-bottom">{owner&&<NavLink to="/settings" onClick={onNavigate}><i className="bi bi-gear"/><span>Settings</span></NavLink>}<NavLink to="/account" onClick={onNavigate}><i className="bi bi-person-circle"/><span>My account</span></NavLink><button type="button" className="sidebar-signout" onClick={signOut}><i className="bi bi-box-arrow-right"/><span>Sign out</span></button></div>
 </aside>
}
