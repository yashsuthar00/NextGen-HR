// In your App.jsx or wherever your router is defined
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIInterviewPage from './pages/AIInterviewPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing routes */}
        <Route path="/interview" element={<AIInterviewPage />} />
        {/* Add more specific interview routes if needed */}
        <Route path="/interview/:id" element={<AIInterviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;