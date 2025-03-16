// frontend/src/components/CandidateDashboard.jsx
import React from 'react';

function CandidateDashboard({ onLogout }) {
  return (
    <div>
      <h2>Candidate Dashboard</h2>
      <p>
        Welcome, candidate! Your application details and profile information will be available here.
      </p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default CandidateDashboard;
