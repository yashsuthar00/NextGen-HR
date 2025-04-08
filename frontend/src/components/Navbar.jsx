// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');
  let role = null;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      role = decoded.role;
    }
  } catch (error) {
    console.error('Invalid token:', error);
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f0f0f0' }}>
      <div>
        <Link to="/">Home</Link>
        <Link to="/dashboard" style={{ marginLeft: '1rem' }}>Dashboard</Link>
        {role === 'admin' && (
          <Link to="/admin/users" style={{ marginLeft: '1rem' }}>User</Link>
        )}
          <Link to="/jobs" style={{ marginLeft: '1rem' }}>jobs</Link>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
