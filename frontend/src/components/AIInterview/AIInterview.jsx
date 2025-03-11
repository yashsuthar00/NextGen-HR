import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import { interviewApi } from '../../services/api';
import QuestionDisplay from './QuestionDisplay';
import VideoRecorder from './VideoRecorder';
import ProgressTracker from './ProgressTracker';
import InterviewComplete from './InterviewComplete';
import uploadManager from '../../services/uploadService';

const AIInterview = () => {
  const { candidateId, interviewTypeId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useInterview();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize the interview
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        setIsInitializing(true);
        
        // Initialize the interview and get the interview ID
        const interviewData = await interviewApi.initializeInterview(
          candidateId,
          interviewTypeId
        );
        
        // Set the candidate info and interview ID
        actions.setCandidateInfo({
          candidateId,
          interviewId: interviewData.interviewId
        });
        
        // Get the interview questions
        const questionsData = await interviewApi.getInterviewQuestions(
          interviewData.interviewId
        );
        
        // Set the questions in the context
        actions.setQuestions(questionsData.questions);
        
        setIsInitializing(false);
        
      } catch (err) {
        console.error('Failed to initialize interview:', err);
        setError('Failed to initialize interview. Please try again later.');
        setIsInitializing(false);
      }
    };
    
    initializeInterview();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [candidateId, interviewTypeId, actions]);
  
  // Handle completion of the interview
  const handleInterviewComplete = async () => {
    try {
      await interviewApi.completeInterview(state.interviewId);
      
      // Show the completion screen
      actions.completeInterview();
      
    } catch (err) {
      console.error('Failed to complete interview:', err);
      setError('Failed to complete interview. Please try again later.');
    }
  };
  
  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (state.currentQuestionIndex === state.questions.length - 1) {
      handleInterviewComplete();
    } else {
      actions.moveToNextQuestion();
    }
  };
  
  // Render loading state
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4">Loading...</div>
          <p>Initializing your interview...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error</div>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => navigate('/interviews')}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  // If the interview is complete, show the completion screen
  if (state.interviewComplete) {
    return <InterviewComplete />;
  }
  
  // Get the current question
  const currentQuestion = state.questions[state.currentQuestionIndex];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressTracker 
        currentQuestion={state.currentQuestionIndex + 1} 
        totalQuestions={state.questions.length} 
        uploadQueue={state.uploadQueue.length}
      />
      
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <QuestionDisplay 
          question={currentQuestion}
          questionNumber={state.currentQuestionIndex + 1}
        />
        
        <VideoRecorder 
          questionId={currentQuestion.id}
          onRecordingComplete={handleNextQuestion}
        />
      </div>
    </div>
  );
};

export default AIInterview;