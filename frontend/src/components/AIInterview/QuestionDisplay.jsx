import React, { useEffect, useState } from 'react';
import speechService from '../../services/speechService';

const QuestionDisplay = ({ question, questionNumber }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  // Check if speech synthesis is supported
  useEffect(() => {
    setSpeechSupported(speechService.isSupported());
  }, []);
  
  // Read the question aloud when it changes
  useEffect(() => {
    if (question && speechSupported) {
      readQuestionAloud();
    }
    
    return () => {
      // Cancel any ongoing speech when component unmounts or question changes
      speechService.cancel();
    };
  }, [question]);
  
  // Function to read the question aloud
  const readQuestionAloud = async () => {
    if (!speechSupported || !question) return;
    
    try {
      setIsSpeaking(true);
      
      // Construct text to speak
      const textToSpeak = `Question ${questionNumber}: ${question.text}`;
      
      // Speak the question
      await speechService.speak(textToSpeak, { rate: 0.9 });
      
      setIsSpeaking(false);
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };
  
  // Toggle speech playback
  const toggleSpeech = () => {
    if (isSpeaking) {
      speechService.cancel();
      setIsSpeaking(false);
    } else {
      readQuestionAloud();
    }
  };
  
  if (!question) {
    return <div>Loading question...</div>;
  }
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-700">
          Question {questionNumber}
        </h2>
        
        {speechSupported && (
          <button
            onClick={toggleSpeech}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            {isSpeaking ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Stop Audio
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                Play Audio
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <p className="text-lg">{question.text}</p>
        
        {question.description && (
          <p className="mt-2 text-gray-600 text-sm">{question.description}</p>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay; 