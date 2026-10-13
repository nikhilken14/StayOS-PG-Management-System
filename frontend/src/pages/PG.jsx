import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "../styles/PG.css";

export default function PG() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", address: "", total_rooms: "" });

  async function loadProperties() {
    setLoading(true);
    try {
      const { data } = await api.get("/pg/list");
      setProperties(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load properties. Try again.");
    } finally { setLoading(false); }
  }
  useEffect(() => { loadProperties(); }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = e => { if (e.key === "Escape" && !busy) setOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy]);
  const visible = useMemo(() => properties.filter(p =>
    `${p.name || ""} ${p.address || ""}`.toLowerCase().includes(search.toLowerCase())
  ), [properties, search]);

  async function addProperty(e) {
    e.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      await api.post("/pg/upload", { name: form.name.trim(), address: form.address.trim(), total_rooms: Number(form.total_rooms) });
      setForm({ name: "", address: "", total_rooms: "" });
      setOpen(false);
      setNotice("Property created successfully.");
      await loadProperties();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create property. Please check your details.");
    } finally { setBusy(false); }
  }

  return <section className="pg-management-page modern-module">
    <header className="module-header">
      <div><span className="module-eyebrow">WORKSPACE / PROPERTIES</span><h1>Properties</h1><p>Manage your PG locations and room capacity in one place.</p></div>
      <button className="module-primary" onClick={() => { setError(""); setOpen(true); }}><i className="bi bi-plus-lg"/> Add property</button>
    </header>
    {notice && <div className="module-notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
    {error && !open && <div className="module-error" role="alert">{error}<button onClick={loadProperties}>Retry</button></div>}
    <div className="module-summary-strip">
      <div><span className="module-stat-icon"><i className="bi bi-buildings"/></span><span><small>Properties</small><strong>{properties.length}</strong></span></div>
      <div><span className="module-stat-icon"><i className="bi bi-door-open"/></span><span><small>Configured rooms</small><strong>{properties.reduce((n,p)=>n+(Number(p.total_rooms)||0),0)}</strong></span></div>
    </div>
    <section className="module-panel">
      <div className="module-panel-header"><div><h2>All properties</h2><p>Your registered PG locations</p></div><label className="module-search"><i className="bi bi-search"/><input placeholder="Search properties..." value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search properties"/></label></div>
      <div className="module-table-scroll"><table className="module-table"><thead><tr><th>Property</th><th>Address</th><th>Rooms</th><th>Property ID</th></tr></thead><tbody>
        {!loading && visible.map(p=><tr key={p.id}><td><span className="module-item-name"><i className="bi bi-building"/>{p.name}</span></td><td>{p.address || "—"}</td><td><span className="module-number-pill">{p.total_rooms ?? 0}</span></td><td className="module-id">#{p.id}</td></tr>)}
      </tbody></table></div>
      {loading ? <div className="module-empty" role="status">Loading properties...</div> : visible.length === 0 ? <div className="module-empty"><i className="bi bi-buildings"/><strong>{search ? "No matching properties" : "No properties yet"}</strong><span>{search ? "Try a different search." : "Add your first PG location to get started."}</span>{!search && <button className="module-secondary" onClick={()=>setOpen(true)}>Add property</button>}</div> : <div className="module-table-footer">Showing {visible.length} of {properties.length} properties</div>}
    </section>
    {open && <div className="module-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy)setOpen(false)}}><div className="module-modal" role="dialog" aria-modal="true" aria-labelledby="add-property-title"><div className="module-modal-header"><div><h2 id="add-property-title">Add property</h2><p>Register a new PG location</p></div><button className="module-close" type="button" aria-label="Close" onClick={()=>setOpen(false)} disabled={busy}><i className="bi bi-x-lg"/></button></div><form onSubmit={addProperty}><div className="module-modal-body"><label>Property name<input autoFocus required maxLength={150} placeholder="e.g. StayOS Central" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></label><label>Total rooms<input required type="number" min="1" step="1" placeholder="e.g. 20" value={form.total_rooms} onChange={e=>setForm(f=>({...f,total_rooms:e.target.value}))}/></label><label>Full address<textarea required rows="3" placeholder="Street, area, city and PIN code" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/></label>{error && <div className="module-error" role="alert">{error}</div>}</div><footer className="module-modal-footer"><button className="module-secondary" type="button" onClick={()=>setOpen(false)} disabled={busy}>Cancel</button><button className="module-primary" disabled={busy}>{busy ? "Creating..." : "Create property"}</button></footer></form></div></div>}
  </section>;
}
