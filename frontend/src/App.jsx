// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UserManagementSystem from './components/UserManagementSystem.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import JobsPage from './pages/JobListPage.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import InterviewCompletePage from './pages/InterviewCompletePage.jsx';
import HomePage from './pages/HomePage.jsx';

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
        path="/users" 
        element={
          <ProtectedRoute requiredRole="admin">
            <UserManagementSystem />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<HomePage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/interview-complete" element={<InterviewCompletePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path='/' element={<AuthPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default App;
