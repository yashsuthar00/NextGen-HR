// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear stored authentication data and navigate to login page
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f0f0f0' }}>
      <div>
        <Link to="/">Home</Link>
        <Link to="/dashboard" style={{ marginLeft: '1rem' }}>Dashboard</Link>
        {
          // Conditionally render the "Admin" link based on user role
          JSON.parse(localStorage.getItem('user'))?.role === 'admin' && (
            <Link to="/admin/users" style={{ marginLeft: '1rem' }}>User</Link>
          )
        }
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
