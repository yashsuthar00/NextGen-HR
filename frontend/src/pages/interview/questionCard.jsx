import React from 'react';

const QuestionCard = ({ question, isActive, currentIndex, totalQuestions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Question {currentIndex} of {totalQuestions}
          
        </span>
        {isActive && (
          <span className={`px-2 py-1 text-xs rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Recording' : 'Ready'}
          </span>
        )}
      </div>
      
      <div className="flex-grow flex items-center">
        <h2 className="text-xl font-medium text-gray-800">
          {isActive ? question : "Questions will appear here when you start the interview"}
        </h2>
      </div>
    </div>
  );
};

export default QuestionCard;