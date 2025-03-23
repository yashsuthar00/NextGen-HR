import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="p-6 bg-indigo-600 text-white">
          <h1 className="text-3xl font-bold">AI Interview Platform</h1>
          <p className="mt-2">Practice your interview skills with our AI interviewer</p>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Start a new interview session</li>
              <li>Answer questions one by one at your own pace</li>
              <li>Click "Next" when you're ready to move to the next question</li>
              <li>Your video and audio responses will be recorded</li>
              <li>Complete all questions or end the interview early if needed</li>
            </ol>
          </div>
          
          <div className="flex justify-center">
            <Link 
              to="/interview"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors"
            >
              Start New Interview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
