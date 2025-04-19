// src/pages/Dashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import UserManagementSystem from '../components/UserManagementSystem.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import EmployeeDashboard from '../components/EmployeeDashboard.jsx';
import CandidateDashboard from '../components/CandidateDashboard.jsx';
import RecruiterDashboard from '../components/RecruiterDashboard.jsx';

const Dashboard = () => {
  const token = localStorage.getItem('authToken');
  let role = null;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      role = decoded.role;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" />;
  }

  if (!role) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        {role === 'admin' && <Route path="/" element={<UserManagementSystem />} />}
        {role === 'hr' && <Route path="/" element={<RecruiterDashboard />} />}
        {role === 'employee' && <Route path="/" element={<EmployeeDashboard />} />}
        {role === 'candidate' && <Route path="/" element={<CandidateDashboard />} />}
        {/* Fallback: if no matching route, redirect to the main dashboard route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
