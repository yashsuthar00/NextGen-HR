import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';

const InterviewComplete = () => {
  const navigate = useNavigate();
  const { state } = useInterview();
  
  // Check if there are still uploads in progress
  const uploadsInProgress = state.uploadQueue.length > 0;
  
  // Redirect if someone tries to access this page directly without completing the interview
  useEffect(() => {
    if (!state.interviewId) {
      navigate('/interviews');
    }
  }, [state.interviewId, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Interview Complete!
        </h1>
        
        {uploadsInProgress ? (
          <>
            <p className="text-gray-600 mb-6">
              Your responses are still being uploaded. Please don't close this window.
            </p>
            
            <div className="flex justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading {state.uploadQueue.length} {state.uploadQueue.length === 1 ? 'response' : 'responses'}...
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Thank you for completing the interview. Your responses have been recorded successfully.
            </p>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate('/interviews')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg"
              >
                Return to Dashboard
              </button>
              
              <button
                onClick={() => window.close()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg"
              >
                Close Window
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewComplete;