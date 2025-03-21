import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAuthenticated || !auth.token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(auth.token);
    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to="/not-found" />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
