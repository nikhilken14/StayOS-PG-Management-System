import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {currentProfile} from "../auth";
import api from "../api/axios";
export default function Account(){
 const profile=currentProfile(),navigate=useNavigate();
 const [form,setForm]=useState({old_password:"",new_password:""}),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 const change=async(e)=>{e.preventDefault();setBusy(true);setMessage("");try{await api.post("/auth/change-password",form);setMessage("Password changed successfully");setForm({old_password:"",new_password:""})}catch(e){setMessage(e.response?.data?.detail||"Could not change password")}finally{setBusy(false)}};
 const logout=()=>{localStorage.removeItem("access_token");localStorage.removeItem("stayos_user");navigate("/")};
 return <section className="account-modern"><span className="section-eyebrow">WORKSPACE / PROFILE</span><h1>My account</h1><p className="account-muted">Manage your identity and account security.</p><div className="account-columns"><div className="account-panel"><h2>Profile information</h2><div className="account-identity"><span>{(profile?.full_name||"U").slice(0,1).toUpperCase()}</span><div><strong>{profile?.full_name||profile?.username}</strong><small>{profile?.role} · @{profile?.username}</small></div></div><p><b>Email</b><span>{profile?.email||"—"}</span></p><p><b>Access</b><span>{profile?.role==="OWNER"?"Workspace owner":"Workspace administrator"}</span></p><button onClick={logout} className="account-logout">Sign out <i className="bi bi-box-arrow-right"/></button></div><form className="account-panel" onSubmit={change}><h2>Change password</h2><p className="account-muted">Use a strong unique password with at least 8 characters.</p><label>Current password<input type="password" required autoComplete="current-password" value={form.old_password} onChange={e=>setForm(f=>({...f,old_password:e.target.value}))}/></label><label>New password<input type="password" required minLength={8} autoComplete="new-password" value={form.new_password} onChange={e=>setForm(f=>({...f,new_password:e.target.value}))}/></label>{message&&<p role="status">{message}</p>}<button className="primary-button" disabled={busy}>{busy?"Updating...":"Update password"}</button></form></div></section>

}
