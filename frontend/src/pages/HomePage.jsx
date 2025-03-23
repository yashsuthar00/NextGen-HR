import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Interview System</h1>
          
          <p className="text-gray-600 mb-6">
            This system allows you to participate in an automated interview process. 
            Your responses will be recorded as video and audio for later review.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-700 mb-3">How it works:</h2>
          
          <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
            <li>You'll be presented with a series of interview questions one at a time</li>
            <li>Your video and audio will be recorded for each response</li>
            <li>Click the "Next Question" button to proceed to the next question</li>
            <li>Each question will be read aloud when displayed</li>
            <li>You can end the interview at any time using the "End Interview" button</li>
          </ul>
          
          <div className="flex justify-center">
            <Link 
              to="/interview" 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Start New Interview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;