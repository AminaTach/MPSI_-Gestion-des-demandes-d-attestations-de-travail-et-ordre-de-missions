// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [role, setRole] = useState('rh');

  return (
    <Router>
      <div className="flex flex-row h-screen">
        <Sidebar role={role} />
        <div className="flex-grow ">
          <Routes>
            <Route path="/rh/dashboard" element={<Dashboard />} />
            {/* Vous pouvez ajouter d'autres routes ici */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
