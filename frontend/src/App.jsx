// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UserManagementSystem from './components/UserManagementSystem.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRole="admin">
            <UserManagementSystem />
          </ProtectedRoute>
        } 
      />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default App;
