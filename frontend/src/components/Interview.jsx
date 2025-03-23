import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Interview = () => {
  const [questions] = useState([
    "Tell us about your background and experience in this field.",
    "What is your greatest professional achievement and why?",
    "How do you handle challenges or conflicts in the workplace?",
    "Where do you see yourself professionally in five years?",
    "Why do you want to work with our company specifically?"
  ]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingStopped, setRecordingStopped] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorderVideoRef = useRef(null);
  const mediaRecorderAudioRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clean up function to stop media tracks when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Setup video recorder
      const videoRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderVideoRef.current = videoRecorder;
      
      // Setup audio recorder (using the same stream but only extracting audio)
      const audioStream = new MediaStream(stream.getAudioTracks());
      const audioRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
      mediaRecorderAudioRef.current = audioRecorder;
      
      // Video data handler
      const videoChunksCollector = [];
      videoRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksCollector.push(e.data);
        }
      };
      
      // Audio data handler
      const audioChunksCollector = [];
      audioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksCollector.push(e.data);
        }
      };
      
      // When recording stops, save the chunks
      videoRecorder.onstop = async () => {
        const videoBlob = new Blob(videoChunksCollector, { type: 'video/webm' });
        
        // Create FormData to send to backend
        const formData = new FormData();
        formData.append('video', videoBlob, `question_${currentQuestionIndex}_video.webm`);
        formData.append('questionIndex', currentQuestionIndex);
        
        try {
          // Upload video chunk asynchronously
          await axios.post('/api/interview/upload-video', formData);
          console.log('Video chunk uploaded successfully');
        } catch (error) {
          console.error('Error uploading video chunk:', error);
        }
        
        // Clear chunks for next recording
        videoChunksCollector.length = 0;
      };
      
      audioRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksCollector, { type: 'audio/webm' });
        
        // Create FormData to send to backend
        const formData = new FormData();
        formData.append('audio', audioBlob, `question_${currentQuestionIndex}_audio.webm`);
        formData.append('questionIndex', currentQuestionIndex);
        
        try {
          // Upload audio chunk asynchronously
          await axios.post('/api/interview/upload-audio', formData);
          console.log('Audio chunk uploaded successfully');
        } catch (error) {
          console.error('Error uploading audio chunk:', error);
        }
        
        // Clear chunks for next recording
        audioChunksCollector.length = 0;
      };
      
      // Start recording
      videoRecorder.start();
      audioRecorder.start();
      setIsRecording(true);
      setRecordingStarted(true);
      
      // Speak the first question
      speakQuestion(questions[currentQuestionIndex]);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera or microphone. Please check your permissions.');
    }
  };
  
  const stopCurrentRecording = () => {
    if (mediaRecorderVideoRef.current && mediaRecorderVideoRef.current.state === 'recording') {
      mediaRecorderVideoRef.current.stop();
    }
    
    if (mediaRecorderAudioRef.current && mediaRecorderAudioRef.current.state === 'recording') {
      mediaRecorderAudioRef.current.stop();
    }
    
    setIsRecording(false);
  };
  
  const startNextRecording = () => {
    if (mediaRecorderVideoRef.current && mediaRecorderAudioRef.current) {
      mediaRecorderVideoRef.current.start();
      mediaRecorderAudioRef.current.start();
      setIsRecording(true);
      
      // Speak the new question
      speakQuestion(questions[currentQuestionIndex]);
    }
  };
  
  const handleNextQuestion = () => {
    // Stop current recording
    stopCurrentRecording();
    
    if (currentQuestionIndex < questions.length - 1) {
      // Go to next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Start new recording after a short delay to allow previous recordings to save
      setTimeout(() => {
        startNextRecording();
      }, 500);
    } else {
      // End of interview
      setRecordingStopped(true);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      alert('Interview complete! Thank you for your responses.');
      navigate('/interview-complete');
    }
  };
  
  const handleEndInterview = () => {
    stopCurrentRecording();
    setRecordingStopped(true);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    alert('Interview ended early. Thank you for your time.');
    navigate('/interview-complete');
  };
  
  const speakQuestion = (question) => {
    const utterance = new SpeechSynthesisUtterance(question);
    speechSynthesis.speak(utterance);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="p-6 bg-indigo-600 text-white">
          <h1 className="text-3xl font-bold">AI Interview</h1>
          <p className="mt-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-inner">
            <h2 className="text-xl font-semibold mb-2">Question:</h2>
            <p className="text-lg">{questions[currentQuestionIndex]}</p>
          </div>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
            {!recordingStopped && (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            {recordingStopped && (
              <div className="flex items-center justify-center h-full text-white">
                Interview Completed
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            {!recordingStarted ? (
              <button
                onClick={startRecording}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start Interview
              </button>
            ) : (
              <>
                <button
                  onClick={handleEndInterview}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  End Interview
                </button>
                
                {isRecording && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse mr-2"></div>
                    <span>Recording...</span>
                  </div>
                )}
                
                <button
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  disabled={!isRecording}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;