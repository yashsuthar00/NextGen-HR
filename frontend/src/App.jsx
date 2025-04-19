// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UserManagementSystem from './components/UserManagementSystem.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import JobsPage from './pages/JobListPage.jsx';
import InterviewPage from './pages/interview/InterviewPage.jsx';
import AppliedJobs from './pages/AppliedJobs.jsx';
import InterviewViewer from './pages/InterviewViewer.jsx';
import ApplicationUserListPage from './pages/ApplicationUserListPage.jsx';

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
      <Route path="/application/user/:jobId" element={<ApplicationUserListPage />} />
      <Route path="/job/application/users/:jobid" element={<InterviewViewer />} />
      <Route path="/interview/report/:interviewId" element={<InterviewViewer />} />
      <Route path="/applied-jobs" element={<AppliedJobs />} />
      <Route path="/interview/:interviewId" element={<InterviewPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path='/' element={<AuthPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default App;
