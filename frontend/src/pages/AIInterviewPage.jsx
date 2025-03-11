import React from 'react';
import { InterviewProvider } from '../context/InterviewContext';
import AIInterview from '../components/AIInterview/AIInterview';

const AIInterviewPage = () => {
  return (
    <InterviewProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              NextGen-HR | AI Interview
            </h1>
          </div>
        </header>
        
        <main>
          <AIInterview />
        </main>
      </div>
    </InterviewProvider>
  );
};

export default AIInterviewPage;