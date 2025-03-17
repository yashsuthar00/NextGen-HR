// src/pages/Dashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard.jsx';
import HRDashboard from '../components/HRDashboard.jsx';
import EmployeeDashboard from '../components/EmployeeDashboard.jsx';
import CandidateDashboard from '../components/CandidateDashboard.jsx';
import Navbar from '../components/Navbar.jsx';

function Dashboard() {
  const user = localStorage.getItem('user');
  const role = user ? JSON.parse(user).role : null;

  if (!role) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          {role === 'admin' && <Route path="/" element={<AdminDashboard />} />}
          {role === 'hr' && <Route path="/" element={<HRDashboard />} />}
          {role === 'employee' && <Route path="/" element={<EmployeeDashboard />} />}
          {role === 'candidate' && <Route path="/" element={<CandidateDashboard />} />}
          {/* Fallback: if no matching route, redirect to the main dashboard route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
