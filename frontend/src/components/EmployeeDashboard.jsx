// frontend/src/components/CandidateDashboard.jsx
import React from 'react';

function EmployeeDashboard({ onLogout }) {
  return (
    <div>
      <h2>Employee Dashboard</h2>
      <p>
        Welcome, Employee! Here you can view your tasks and performance metrics.
      </p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default EmployeeDashboard;
