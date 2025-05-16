import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import "./App.css";
import ForgotPasswordPage from "./pages/ForgetPW";
import OrdreMissionForm from "./pages/OrdreMission/OrdreMissionForm";
import OrdreMissionTable from "./pages/OrdreMission/OrdreMissionTable";
import OrdreMissionDoc from "./pages/OrdreMission/OrdreMissionDoc";
import DeposerDemande from './pages/DeposerDemande';
import SuiviDemandes from './pages/SuiviDemande';
import TelechargerDocuments from './pages/TelechargerDocs';
import PrivateRoute from "./components/PrivateRoute";
import ViewAttes from "./pages/RH/ViewAttes";
import AttestationsTravail from "./components/AttestationsTravail";
import RH from './pages/RH'

function AppContent({ role, setRole }) {
  const location = useLocation();

  const hideSidebarRoutes = ["/", "/forgetpassword"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col h-full sm:flex-row bg-bleu_bg">
      {!hideSidebar && <Sidebar role={role} setRole={setRole} />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />



          <Route path="/forgetpassword" element={<ForgotPasswordPage />} />
          <Route element={<PrivateRoute role={role} />}>
            <Route path="/rh/dashboard" element={<Dashboard />} />
            <Route path="/employee/demande" element={<DeposerDemande />} />
            <Route path="/employee/suivi" element={<SuiviDemandes />} />
            <Route path="/employee/docs" element={<TelechargerDocuments />} />
            {/* RH Ordre Mission */}
            <Route path="/rh/ordremissionform" element={<OrdreMissionForm />} />
            <Route path="/rh/ordremissiontable" element={<OrdreMissionTable />} />
            <Route path="/rh/ordremissiondoc" element={<OrdreMissionDoc />} />
            {/* Add other protected routes here */}
            <Route path="/rh/docs" element={<RH />} />
            <Route path="/rh/attestation" element={<AttestationsTravail />} />
            <Route path="/ViewAttes/:id" element={<ViewAttes />} />
          </Route>
          {/* Add other public routes here */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.user_type) {
      setRole(userData.user_type);
    }
  }, []);

 

  return (
    <GoogleOAuthProvider clientId="318367454563-v857090khdr2rk94jff2apmh0ifq7irh.apps.googleusercontent.com">
      <Router>
        <AppContent role={role} setRole={setRole} />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
