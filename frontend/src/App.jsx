import Team from "./pages/Team";
import { isOwner } from "./auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import PG from "./pages/PG";
import Residents from "./pages/Residents";
import Rooms from "./pages/Rooms";
import Allocation from "./pages/Allocation";
import Rent from "./pages/Rent";
import Payment from "./pages/Payment";
import Complaint from "./pages/Complaint";
import Notification from "./pages/Notification";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import About from "./pages/About";
import RolesAccess from "./pages/RolesAccess";
import Visitor from "./pages/Visitor";
import Report from "./pages/Report";
import ResidentMovement from "./pages/ResidentMovement";
import Bill from "./pages/Bill";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "./components/Layout";
import { Navigate } from "react-router-dom";


function App(){

return (

<BrowserRouter>

<Routes>

<Route
path="/"
element={<Auth/>}
/>

<Route
path="/signup"
element={<Signup/>}
/>

<Route
path="/reset"
element={<ResetPassword/>}
/>


<Route

element={

<ProtectedRoute>

<Layout/>

</ProtectedRoute>

}

>

<Route
path="/home"
element={<Dashboard/>}
/>

<Route
path="/pg"
element={<PG/>}
/>

<Route
path="/residents"
element={<Residents/>}
/>

<Route
path="/rooms"
element={<Rooms/>}
/>

<Route
path="/allocation"
element={<Allocation/>}
/>

<Route
path="/residentmovement"
element={<ResidentMovement/>}
/>

<Route
path="/rent"
element={<Rent/>}
/>

<Route
path="/payment"
element={<Payment/>}
/>

<Route
path="/bill"
element={<Bill/>}
/>


<Route
path="/visitor"
element={<Visitor/>}
/>

<Route
path="/report"
element={<Report/>}
/>

<Route
path="/complaint"
element={<Complaint/>}
/>

<Route
path="/notification"
element={<Notification/>}
/>

<Route
path="/settings"
element={isOwner()?<Settings/>:<Navigate to="/home" replace/>}
/>

<Route
path="/account"
element={<Account/>}
/>

<Route
path="/about"
element={<About/>}
/>

<Route path="/team" element={isOwner()?<Team/>:<Navigate to="/home" replace/>}/>
<Route path="/roles-access" element={<Navigate to="/team" replace/>}/>

</Route>


<Route path="*" element={<Navigate to="/" replace />} />


</Routes>

</BrowserRouter>

)}

export default App;
