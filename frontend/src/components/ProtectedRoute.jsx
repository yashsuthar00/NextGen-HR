import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/not-found" />;
  }

  return children;
};

export default ProtectedRoute;
