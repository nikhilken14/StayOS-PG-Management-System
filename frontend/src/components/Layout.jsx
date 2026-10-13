import { useState,useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import api from "../api/axios";
import "../styles/components.css";
export default function Layout(){
 const [sidebarOpen,setSidebarOpen]=useState(false);
 const navigate=useNavigate();
 useEffect(()=>{api.get("/auth/me").then(({data})=>{localStorage.setItem("stayos_user",JSON.stringify(data));}).catch(()=>navigate("/",{replace:true}));},[navigate]);
 return <div className="app"><div className="body-layout"><Sidebar open={sidebarOpen} onNavigate={()=>setSidebarOpen(false)}/>{sidebarOpen&&<button className="mobile-overlay" aria-label="Close menu" onClick={()=>setSidebarOpen(false)}/>}<div className="workspace-main"><Navbar toggleSidebar={()=>setSidebarOpen(x=>!x)}/><main className="page-container"><div className="content"><Outlet/></div></main></div></div></div>
}
