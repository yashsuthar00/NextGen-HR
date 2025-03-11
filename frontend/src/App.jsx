import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Layout
import Layout from './components/common/Layout';

// Auth components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Dashboard components
import AdminDashboard from './components/dashboard/AdminDashboard';
import RecruiterDashboard from './components/dashboard/RecruiterDashboard';
import CandidateDashboard from './components/dashboard/CandidateDashboard';

// Interview components
import InterviewList from './components/interviews/InterviewList';
import InterviewForm from './components/interviews/InterviewForm';
import InterviewDetail from './components/interviews/InterviewDetail';
import VideoRecorder from './components/interviews/VideoRecorder';

// Protected route component
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

// Separate component for routes to access auth context
const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  // Show loading state while authentication status is being determined
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to redirect based on user role
  const getDashboardForRole = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'recruiter':
        return <RecruiterDashboard />;
      case 'candidate':
        return <CandidateDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} />
      
      {/* Protected routes wrapped in Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard route - redirects based on user role */}
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={getDashboardForRole()} />
        
        {/* Interview routes */}
        <Route path="interviews">
          <Route index element={<InterviewList />} />
          <Route path="new" element={
            <ProtectedRoute requiredPermission="CREATE_INTERVIEW">
              <InterviewForm />
            </ProtectedRoute>
          } />
          <Route path=":id" element={<InterviewDetail />} />
          <Route path=":id/edit" element={
            <ProtectedRoute requiredPermission="EDIT_INTERVIEW">
              <InterviewForm interview={null} /> {/* interview prop will be populated in the component */}
            </ProtectedRoute>
          } />
          <Route path=":id/join" element={<VideoRecorder />} />
        </Route>
        
        {/* Admin-specific routes */}
        <Route path="admin">
          <Route index element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Add other admin routes as needed */}
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">The page you are looking for doesn't exist or has been moved.</p>
            <button 
              onClick={() => window.history.back()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default App;