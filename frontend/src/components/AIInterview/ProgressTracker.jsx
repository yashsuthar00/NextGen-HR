import React from 'react';

const ProgressTracker = ({ currentQuestion, totalQuestions, uploadQueue = 0 }) => {
  // Calculate progress percentage
  const progressPercentage = Math.floor((currentQuestion / totalQuestions) * 100);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <div className="text-sm text-gray-600">
          {uploadQueue > 0 && (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {uploadQueue} {uploadQueue === 1 ? 'response' : 'responses'} uploading
            </span>
          )}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressTracker;