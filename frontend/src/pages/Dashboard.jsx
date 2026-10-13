import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { currentProfile, isOwner } from '../auth';
import '../styles/Dashboard.css';
import '../styles/ReferenceDashboard.css';

const fmt = new Intl.NumberFormat('en-IN', {maximumFractionDigits:0});
const zero = {pgs:0,residents:0,rooms:0,totalBeds:0,occupiedBeds:0,availableBeds:0,complaints:0,collection:0};
const rupees = value => `₹${fmt.format(Number(value) || 0)}`;
function Greeting(){const h=new Date().getHours();return h<12?'morning':h<17?'afternoon':'evening';}
function Metric({title,value,note,icon,tone,to}){return <Link to={to} className={`ref-metric ref-${tone}`}><span className="ref-metric-icon"><i className={`bi ${icon}`}/></span><span className="ref-metric-label">{title}</span><strong>{value}</strong><small>{note}</small></Link>}
function PanelTitle({children,to,label}){return <header className="ref-panel-title"><h2>{children}</h2>{to&&<Link to={to}>{label||'View details'} <i className="bi bi-arrow-up-right"/></Link>}</header>}
export default function Dashboard(){
 const [data,setData]=useState(zero),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let live=true;api.get('/dashboard/summary').then(({data:result})=>{if(live)setData({...zero,...result})}).catch(e=>{if(live)setError(e.response?.data?.detail||'Unable to load workspace dashboard. Please retry.')}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[]);
 const occupancy=data.totalBeds?Math.min(100,Math.round(Number(data.occupiedBeds)/Number(data.totalBeds)*100)):0;
 const user=currentProfile();const name=(user?.full_name||user?.username||'there').trim().split(' ')[0];
 const cards=[
  {title:'Properties',value:data.pgs,note:'Managed locations',icon:'bi-buildings',tone:'blue',to:'/pg'},
  {title:'Residents',value:data.residents,note:'Registered residents',icon:'bi-people',tone:'violet',to:'/residents'},
  {title:'Occupied beds',value:data.occupiedBeds,note:`${occupancy}% occupancy`,icon:'bi-person-check',tone:'green',to:'/allocation'},
  {title:'Vacant beds',value:data.availableBeds,note:`${data.totalBeds} total beds`,icon:'bi-door-open',tone:'amber',to:'/rooms'},
  {title:'Collections',value:rupees(data.collection),note:'Payments recorded',icon:'bi-wallet2',tone:'teal',to:'/payment'},
  {title:'Open issues',value:data.complaints,note:'Complaints to review',icon:'bi-chat-left-text',tone:'rose',to:'/complaint'}
 ];
 return <section className="ref-dashboard" aria-busy={loading}>
  <header className="ref-welcome"><div><div className="ref-eyebrow">{isOwner()?'OWNER WORKSPACE':'ADMIN WORKSPACE'} <span className="ref-live"><i/> Live overview</span></div><h1>Good {Greeting()}, {name} <span aria-hidden="true">👋</span></h1><p>Here's what's happening across your properties today.</p></div><span className="ref-today"><i className="bi bi-calendar3"/> {new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'}).format(new Date())}</span></header>
  {error&&<div role="alert" className="ref-error">{error} <button onClick={()=>window.location.reload()}>Retry</button></div>}
  <div className="ref-metrics">{cards.map(x=><Metric key={x.title} {...x} value={loading?'—':x.value}/>)}</div>
  <div className="ref-panels">
   <article className="ref-panel"><PanelTitle to="/rooms" label="Manage capacity">Occupancy</PanelTitle><p className="ref-subtitle">Live bed allocation across your workspace</p><div className="ref-occupancy"><div className="ref-donut" style={{'--percent':`${occupancy}%`}}><div><strong>{loading?'—':`${occupancy}%`}</strong><small>occupied</small></div></div><div className="ref-legend"><div><span><i className="ref-dot green"/> Occupied</span><strong>{data.occupiedBeds}</strong></div><div><span><i className="ref-dot amber"/> Available</span><strong>{data.availableBeds}</strong></div><div><span><i className="ref-dot slate"/> Total capacity</span><strong>{data.totalBeds}</strong></div></div></div><div className="ref-panel-foot"><i className="bi bi-info-circle"/> Based on active allocations. No sample values are displayed.</div></article>
   <article className="ref-panel"><PanelTitle to="/report" label="All reports">Financials</PanelTitle><p className="ref-subtitle">Amounts recorded in StayOS</p><div className="ref-finance-row"><span className="ref-row-icon"><i className="bi bi-cash-stack"/></span><div><small>Total collections</small><strong>{loading?'—':rupees(data.collection)}</strong></div><Link to="/payment" aria-label="View payments"><i className="bi bi-chevron-right"/></Link></div><div className="ref-finance-row"><span className="ref-row-icon amber"><i className="bi bi-receipt"/></span><div><small>Rent & billing</small><strong>View ledger</strong></div><Link to="/rent" aria-label="View rent"><i className="bi bi-chevron-right"/></Link></div><div className="ref-notice">Financial totals include only payments recorded in the application.</div></article>
   <article className="ref-panel"><PanelTitle to="/complaint" label="Review complaints">Issues overview</PanelTitle><p className="ref-subtitle">Complaints awaiting attention</p><div className="ref-count"><strong>{loading?'—':data.complaints}</strong><span>Open complaints</span></div><div className="ref-progress"><span style={{width:data.complaints? '100%':'0%'}}/></div><div className="ref-panel-foot">For issue details and status changes, open Complaints.</div></article>
   <article className="ref-panel"><PanelTitle to="/pg" label="View properties">Workspace activity</PanelTitle><p className="ref-subtitle">Current operational footprint</p><div className="ref-small-stats"><div><strong>{data.pgs}</strong><span>Properties</span></div><div><strong>{data.rooms}</strong><span>Rooms</span></div><div><strong>{data.residents}</strong><span>Residents</span></div></div><div className="ref-shortcuts"><Link to={isOwner()?'/team':'/allocation'}>{isOwner()?'Manage team':'Manage allocations'} <i className="bi bi-arrow-right"/></Link><Link to="/report">Open reports <i className="bi bi-arrow-right"/></Link></div></article>
  </div>
 </section>
}
