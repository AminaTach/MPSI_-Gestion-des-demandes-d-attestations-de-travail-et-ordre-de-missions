import React, { useState } from "react";
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
import RH from "./pages/RH";
import ViewAttes from "./pages/RH/ViewAttes";
import AttestationsTravail from "./components/AttestationsTravail";

function AppContent({ role }) {
  const location = useLocation();

  const hideSidebarRoutes = ["/login", "/forgetpassword"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col sm:flex-row bg-bleu_bg">
      {!hideSidebar && <Sidebar role={role} />}
      <div className="flex-grow">
        <Routes>
          <Route path="/RhDocuments" element={<RH />} />
          <Route path="/AttestationsRH" element={<AttestationsTravail />} />
          <Route path="/ViewAttes" element={<ViewAttes />} />

          <Route path="/rh/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgotPasswordPage />} />
          {/* RH Ordre Mission */}
          <Route path="/rh/ordremissionform" element={<OrdreMissionForm />} />
          <Route path="/rh/ordremissiontable" element={<OrdreMissionTable />} />
          <Route path="/rh/ordremissiondoc" element={<OrdreMissionDoc />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState("rh");

  return (
    <Router>
      <AppContent role={role} />
    </Router>
  );
}

export default App;
