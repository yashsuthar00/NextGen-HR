import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InterviewPage = () => {
  // Sample interview questions
  const interviewQuestions = [
    "Tell me about your background and experience in this field.",
    "What are your greatest strengths and how do they help you in your professional life?",
    "Describe a challenging situation you faced at work and how you resolved it.",
    "Why are you interested in this position?",
    "Where do you see yourself professionally in five years?"
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("Not started");
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const navigate = useNavigate();
  
  const videoChunks = useRef([]);
  const audioChunks = useRef([]);

  // Initialize recording
  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setRecordingStatus("Ready to start");
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setRecordingStatus("Error: Could not access camera or microphone");
      }
    };
    
    startMedia();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Function to speak the current question
  const speakQuestion = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Start recording for the first question
  const startInterview = () => {
    setIsRecording(true);
    startRecordingChunk();
    speakQuestion(interviewQuestions[currentQuestionIndex]);
    setRecordingStatus("Recording");
  };

  // Start recording a new chunk
  const startRecordingChunk = () => {
    if (!streamRef.current) return;
    
    // Set up video recorder
    const videoRecorder = new MediaRecorder(
      new MediaStream(streamRef.current.getVideoTracks()),
      { mimeType: 'video/webm' }
    );
    
    videoRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        videoChunks.current.push(e.data);
      }
    };
    
    // Set up audio recorder
    const audioRecorder = new MediaRecorder(
      new MediaStream(streamRef.current.getAudioTracks()),
      { mimeType: 'audio/webm' }
    );
    
    audioRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.current.push(e.data);
      }
    };
    
    mediaRecorderRef.current = videoRecorder;
    audioRecorderRef.current = audioRecorder;
    
    videoRecorder.start();
    audioRecorder.start();
  };

  // Save the current chunk and move to next question
  const saveChunkAndMoveNext = async () => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      audioRecorderRef.current.stop();
      
      // Wait for the data to be available
      await new Promise(resolve => {
        mediaRecorderRef.current.onstop = resolve;
      });
      
      // Create video blob and upload
      const videoBlob = new Blob(videoChunks.current, { type: 'video/mp4' });
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/m4a' });
      
      // Upload the current chunks
      uploadChunk(videoBlob, audioBlob, currentQuestionIndex);
      
      // Reset chunks for next recording
      videoChunks.current = [];
      audioChunks.current = [];
      
      // Move to next question or end interview
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        
        // Start recording for next question
        startRecordingChunk();
        
        // Speak the next question
        speakQuestion(interviewQuestions[nextIndex]);
      } else {
        // End of interview
        endInterview();
      }
    }
  };

  // Upload chunks to backend
  const uploadChunk = async (videoBlob, audioBlob, questionIndex) => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, `question_${questionIndex + 1}.mp4`);
      formData.append('audio', audioBlob, `question_${questionIndex + 1}.m4a`);
      formData.append('questionIndex', questionIndex);
      formData.append('questionText', interviewQuestions[questionIndex]);
      
      await axios.post('http://localhost:8000/api/upload-chunk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(`Chunk ${questionIndex + 1} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading chunk:', error);
    }
  };

  // End the interview
  const endInterview = () => {
    setIsRecording(false);
    setRecordingStatus("Interview completed");
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    window.speechSynthesis.cancel();
    
    // Navigate to completion page or show completion message
    setTimeout(() => {
      navigate('/interview-complete');
    }, 2000);
  };

  // Force end interview
  const forceEndInterview = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      audioRecorderRef.current.stop();
      
      // Upload the last chunk if there's data
      if (videoChunks.current.length > 0 && audioChunks.current.length > 0) {
        const videoBlob = new Blob(videoChunks.current, { type: 'video/mp4' });
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/m4a' });
        uploadChunk(videoBlob, audioBlob, currentQuestionIndex);
      }
    }
    
    window.speechSynthesis.cancel();
    
    endInterview();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Interview</h1>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {interviewQuestions.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isRecording ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
              }`}>
                {recordingStatus}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestionIndex) / interviewQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow-inner min-h-[100px]">
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              {interviewQuestions[currentQuestionIndex]}
            </h2>
            {isSpeaking && (
              <span className="inline-flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Speaking...
              </span>
            )}
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="bg-black rounded-lg overflow-hidden w-full max-w-md aspect-video">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
              ></video>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {!isRecording ? (
              <button
                onClick={startInterview}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Start Interview
              </button>
            ) : (
              <>
                <button
                  onClick={saveChunkAndMoveNext}
                  disabled={isSpeaking}
                  className={`px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors ${
                    isSpeaking ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {currentQuestionIndex < interviewQuestions.length - 1 ? "Next Question" : "Finish Interview"}
                </button>
                
                <button
                  onClick={forceEndInterview}
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                >
                  End Interview
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;