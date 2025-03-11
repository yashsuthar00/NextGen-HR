import React, { createContext, useReducer, useContext } from 'react';

// Initial state for the interview
const initialState = {
  currentQuestionIndex: 0,
  questions: [],
  candidateId: null,
  interviewId: null,
  responses: [], // Will store metadata for each response
  isLoading: true,
  isRecording: false,
  uploadQueue: [], // Queue of videos waiting to be uploaded
  uploadProgress: {}, // Track progress of each upload by responseId
  error: null,
  interviewComplete: false
};

// Action types
const ActionTypes = {
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_CANDIDATE_INFO: 'SET_CANDIDATE_INFO',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  START_RECORDING: 'START_RECORDING',
  STOP_RECORDING: 'STOP_RECORDING',
  ADD_RESPONSE: 'ADD_RESPONSE',
  ADD_TO_UPLOAD_QUEUE: 'ADD_TO_UPLOAD_QUEUE',
  UPDATE_UPLOAD_PROGRESS: 'UPDATE_UPLOAD_PROGRESS',
  UPLOAD_COMPLETE: 'UPLOAD_COMPLETE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  COMPLETE_INTERVIEW: 'COMPLETE_INTERVIEW'
};

// Reducer function to handle state updates
const interviewReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        isLoading: false
      };
    
    case ActionTypes.SET_CANDIDATE_INFO:
      return {
        ...state,
        candidateId: action.payload.candidateId,
        interviewId: action.payload.interviewId
      };
    
    case ActionTypes.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: action.payload
      };
    
    case ActionTypes.START_RECORDING:
      return {
        ...state,
        isRecording: true
      };
    
    case ActionTypes.STOP_RECORDING:
      return {
        ...state,
        isRecording: false
      };
    
    case ActionTypes.ADD_RESPONSE:
      return {
        ...state,
        responses: [...state.responses, action.payload]
      };
    
    case ActionTypes.ADD_TO_UPLOAD_QUEUE:
      return {
        ...state,
        uploadQueue: [...state.uploadQueue, action.payload]
      };
    
    case ActionTypes.UPDATE_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.responseId]: action.payload.progress
        }
      };
    
    case ActionTypes.UPLOAD_COMPLETE:
      return {
        ...state,
        uploadQueue: state.uploadQueue.filter(item => item.responseId !== action.payload.responseId),
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.responseId]: 100
        }
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ActionTypes.COMPLETE_INTERVIEW:
      return {
        ...state,
        interviewComplete: true
      };
    
    default:
      return state;
  }
};

// Create the context
const InterviewContext = createContext();

// Provider component
export const InterviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(interviewReducer, initialState);
  
  // Actions
  const actions = {
    setQuestions: (questions) => {
      dispatch({ type: ActionTypes.SET_QUESTIONS, payload: questions });
    },
    
    setCandidateInfo: (info) => {
      dispatch({ type: ActionTypes.SET_CANDIDATE_INFO, payload: info });
    },
    
    moveToNextQuestion: () => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        dispatch({ 
          type: ActionTypes.SET_CURRENT_QUESTION, 
          payload: state.currentQuestionIndex + 1 
        });
      } else {
        dispatch({ type: ActionTypes.COMPLETE_INTERVIEW });
      }
    },
    
    startRecording: () => {
      dispatch({ type: ActionTypes.START_RECORDING });
    },
    
    stopRecording: () => {
      dispatch({ type: ActionTypes.STOP_RECORDING });
    },
    
    addResponse: (response) => {
      dispatch({ type: ActionTypes.ADD_RESPONSE, payload: response });
    },
    
    addToUploadQueue: (item) => {
      dispatch({ type: ActionTypes.ADD_TO_UPLOAD_QUEUE, payload: item });
    },
    
    updateUploadProgress: (responseId, progress) => {
      dispatch({ 
        type: ActionTypes.UPDATE_UPLOAD_PROGRESS, 
        payload: { responseId, progress } 
      });
    },
    
    completeUpload: (responseId) => {
      dispatch({ 
        type: ActionTypes.UPLOAD_COMPLETE, 
        payload: { responseId } 
      });
    },
    
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },
    
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    }
  };
  
  return (
    <InterviewContext.Provider value={{ state, actions }}>
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook for using the interview context
export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};