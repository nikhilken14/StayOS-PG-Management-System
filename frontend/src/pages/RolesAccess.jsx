import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/RolesAccess.css";


const MODULE_META = {

dashboard: { label: "Dashboard", icon: "bi-speedometer2" },
pg: { label: "PG", icon: "bi-building" },
residents: { label: "Residents", icon: "bi-people" },
rooms: { label: "Rooms", icon: "bi-door-open" },
allocation: { label: "Allocation", icon: "bi-grid" },
rent: { label: "Rent", icon: "bi-cash" },
payment: { label: "Payment", icon: "bi-credit-card" },
bill: { label: "Bills", icon: "bi-receipt-cutoff" },
residentmovement: { label: "Entry / Exit", icon: "bi-box-arrow-in-right" },
visitor: { label: "Visitor", icon: "bi-person-walking" },
complaint: { label: "Complaints", icon: "bi-chat-left-text" },
notification: { label: "Notifications", icon: "bi-bell" },
report: { label: "Report", icon: "bi-file-earmark-bar-graph" },
settings: { label: "Settings", icon: "bi-gear" },

};


export default function RolesAccess(){


const [modules,setModules] = useState([]);

const [roles,setRoles] = useState([]);

const [selectedId,setSelectedId] = useState(null);

const [newRoleName,setNewRoleName] = useState("");

const [showAdd,setShowAdd] = useState(false);

const [saved,setSaved] = useState(false);

const [loading,setLoading] = useState(true);

const [error,setError] = useState("");


const selectedRole = roles.find(r=>r.id===selectedId) || roles[0];


useEffect(()=>{

loadAll();

},[]);


useEffect(()=>{

if(saved){

const t = setTimeout(()=>setSaved(false),2000);

return ()=>clearTimeout(t);

}

},[saved]);


const loadAll = async () => {

setLoading(true);
setError("");

try{

const [modulesRes, rolesRes] = await Promise.all([
api.get("/roles/modules"),
api.get("/roles/list")
]);

setModules(modulesRes.data);
setRoles(rolesRes.data);

setSelectedId(prev => prev ?? rolesRes.data[0]?.id);

}
catch(err){

setError(
err.response?.data?.detail ||
"Could not load roles. Is the backend running?"
);

}
finally{

setLoading(false);

}

};


const togglePermission = async (moduleKey) => {

if(!selectedRole || selectedRole.locked) return;

const nextPermissions = {
...selectedRole.permissions,
[moduleKey]: !selectedRole.permissions[moduleKey]
};

try{

const res = await api.put(
`/roles/${selectedRole.id}/permissions`,
{ permissions: nextPermissions }
);

setRoles(roles.map(r => r.id === selectedRole.id ? res.data : r));

setSaved(true);

}
catch(err){

alert(err.response?.data?.detail || "Could not update permission");

}

};


const toggleAll = async (grantAll) => {

if(!selectedRole || selectedRole.locked) return;

try{

const res = await api.put(
`/roles/${selectedRole.id}/permissions/bulk`,
{ grant_all: grantAll }
);

setRoles(roles.map(r => r.id === selectedRole.id ? res.data : r));

setSaved(true);

}
catch(err){

alert(err.response?.data?.detail || "Could not update permissions");

}

};


const addRole = async () => {

const name = newRoleName.trim();

if(!name) return;

try{

const res = await api.post("/roles/create", { name });

setRoles([...roles, res.data]);

setSelectedId(res.data.id);

setNewRoleName("");

setShowAdd(false);

}
catch(err){

alert(err.response?.data?.detail || "Could not create role");

}

};


const deleteRole = async (id) => {

const role = roles.find(r=>r.id===id);

if(!role || role.locked) return;

if(!window.confirm(`Delete the "${role.name}" role?`)) return;

try{

await api.delete(`/roles/${id}`);

const next = roles.filter(r=>r.id!==id);

setRoles(next);

if(selectedId===id){
setSelectedId(next[0]?.id);
}

}
catch(err){

alert(err.response?.data?.detail || "Could not delete role");

}

};


const grantedCount = selectedRole
? modules.filter(m=>selectedRole.permissions[m]).length
: 0;



if(loading){

return(
<div className="roles-page">
<div className="roles-loading">
<i className="bi bi-arrow-repeat spin"></i>
Loading roles...
</div>
</div>
);

}


if(error){

return(
<div className="roles-page">
<div className="roles-error">
<i className="bi bi-exclamation-triangle"></i>
{error}
<button className="roles-secondary-btn" onClick={loadAll}>
Retry
</button>
</div>
</div>
);

}



return(

<div className="roles-page">


<div className="roles-header">

<div>

<h1>
Roles &amp; Access
</h1>

<p>
Define roles and control which modules each role can access
</p>

</div>


<button
className="roles-add-btn"
onClick={()=>setShowAdd(true)}
>
<i className="bi bi-plus-lg"></i>
Add Role
</button>

</div>




{
saved &&

<div className="roles-saved-toast">
<i className="bi bi-check-circle"></i>
Changes saved
</div>

}




<div className="roles-layout">


{/* ROLE LIST */}

<div className="roles-list-card">

<div className="roles-list-title">
Roles
</div>


<div className="roles-list">

{roles.map(role=>(

<div
key={role.id}
className={`role-item ${selectedId===role.id ? "active":""}`}
onClick={()=>setSelectedId(role.id)}
>

<div className="role-item-main">

<span className="role-item-name">
{role.name}
</span>

{role.locked &&
<i className="bi bi-lock-fill role-lock"></i>
}

</div>


<span className="role-item-count">
{modules.filter(m=>role.permissions[m]).length}/{modules.length}
</span>


{
!role.locked &&

<button
className="role-item-delete"
onClick={(e)=>{ e.stopPropagation(); deleteRole(role.id); }}
title="Delete role"
>
<i className="bi bi-trash"></i>
</button>

}

</div>

))}

</div>




{
showAdd &&

<div className="role-add-box">

<input
autoFocus
placeholder="Role name e.g. Supervisor"
value={newRoleName}
onChange={(e)=>setNewRoleName(e.target.value)}
onKeyDown={(e)=>{ if(e.key==="Enter") addRole(); }}
/>

<div className="role-add-actions">

<button className="roles-secondary-btn" onClick={()=>{setShowAdd(false); setNewRoleName("");}}>
Cancel
</button>

<button className="roles-primary-btn" onClick={addRole}>
Create
</button>

</div>

</div>

}

</div>




{/* PERMISSIONS PANEL */}

<div className="roles-permissions-card">


{
selectedRole &&

<>

<div className="permissions-header">

<div>

<h3>
{selectedRole.name}

{selectedRole.locked &&
<span className="role-locked-badge">
<i className="bi bi-lock-fill"></i> Locked
</span>
}
</h3>

<p>
{selectedRole.description}
</p>

</div>


<div className="permissions-header-actions">

<span className="permissions-count">
{grantedCount} / {modules.length} modules
</span>

{
!selectedRole.locked &&

<div className="permissions-bulk">

<button onClick={()=>toggleAll(true)}>
Grant All
</button>

<button onClick={()=>toggleAll(false)}>
Revoke All
</button>

</div>

}

</div>

</div>




<div className="permissions-grid">

{modules.map(moduleKey=>(

<div className="permission-row" key={moduleKey}>

<div className="permission-row-info">

<div className="permission-row-icon">
<i className={`bi ${MODULE_META[moduleKey]?.icon || "bi-app"}`}></i>
</div>

<span>
{MODULE_META[moduleKey]?.label || moduleKey}
</span>

</div>


<label className={`switch ${selectedRole.locked ? "disabled":""}`}>

<input
type="checkbox"
checked={!!selectedRole.permissions[moduleKey]}
onChange={()=>togglePermission(moduleKey)}
disabled={selectedRole.locked}
/>

<span></span>

</label>

</div>

))}

</div>


{
selectedRole.locked &&

<div className="permissions-note">
<i className="bi bi-info-circle"></i>
The Admin role always has full access and cannot be changed.
</div>

}

</>

}

</div>


</div>


</div>

)}
