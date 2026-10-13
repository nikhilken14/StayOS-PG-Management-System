import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Settings.css";
import "../styles/OwnerPages.css";

export default function Settings() {
  const [smtp, setSmtp] = useState({sender_email: "", app_password: ""});
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    api.get("/auth/smtp/status").then(({data}) => {
      setSmtp(s => ({...s, sender_email: data.sender_email || ""}));
      setConfigured(Boolean(data.is_configured));
    }).catch(e => {setFailed(true); setNotice(e.response?.data?.detail || "Could not load email settings. Check backend connection and OWNER access.");})
      .finally(() => setLoading(false));
  }, []);
  const save = async (e) => {
    e.preventDefault(); setBusy(true); setNotice(""); setFailed(false);
    try {
      await api.post("/auth/smtp/set", smtp);
      setConfigured(true); setSmtp(v => ({...v, app_password: ""}));
      setNotice("Email configuration saved securely for this workspace.");
    } catch(e) { setFailed(true); setNotice(e.response?.data?.detail || "Unable to save settings."); }
    finally { setBusy(false); }
  };
  return <section className="owner-page">
    <div className="owner-page-heading"><div><span className="section-eyebrow">WORKSPACE / CONFIGURATION</span><h1>Workspace settings</h1><p>Manage email delivery for your residents and notifications.</p></div><span className="owner-pill">OWNER ONLY</span></div>
    {notice && <p className={`owner-notice ${failed?"owner-error":""}`} role="status">{notice}</p>}
    <div className="owner-layout"><div className="owner-card"><div className="owner-card-heading"><span className="owner-card-icon">✉</span><div><h2>Outgoing email</h2><p>Configure the sender address used for resident notifications.</p></div></div>
      <p className="owner-state">{loading ? "Checking configuration…" : configured ? "● Configured" : "○ Not configured"}</p>
      <form className="owner-form" onSubmit={save}><label>Sender email<input type="email" required autoComplete="email" placeholder="notifications@yourdomain.com" value={smtp.sender_email} onChange={e=>setSmtp(v=>({...v,sender_email:e.target.value}))}/></label>
      <label>SMTP app password<input type="password" required={!configured} autoComplete="new-password" placeholder={configured?"Enter a new password to replace existing":"Enter app password"} value={smtp.app_password} onChange={e=>setSmtp(v=>({...v,app_password:e.target.value}))}/></label>
      <button className="primary-button" disabled={busy||loading}>{busy?"Saving…":"Save email settings"}</button></form>
    </div><aside className="owner-card owner-help"><h2>Security & access</h2><p>Only workspace owners can manage these settings. SMTP passwords are encrypted before storage; existing passwords are never returned by the API.</p><p>Use a provider-issued SMTP app password, not your regular email password.</p><p>For deployed environments, configure HTTPS and keep the encryption key outside source control.</p></aside></div>
  </section>;
}
