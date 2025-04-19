import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CameraPreview from './camaraPreview';
import MicMeter from './MicMeter';
import Modal from './Model';
import QuestionCard from './questionCard';
import Timer from './Timer';

const InterviewPage = () => {
  const { interviewId } = useParams(); // Extract interviewId from the URL

  // State management
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isPreparationMode, setIsPreparationMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'start', 'guide', 'end', 'permission'
  const [error, setError] = useState(null);
  const [_, setPermissionsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const timerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const audioChunksRef = useRef([]);

  // Fetch interview questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/interview/${interviewId}`
        );
        setQuestions(response.data.questions);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch interview questions:", err);
        setError("Failed to load interview questions. Please try again.");
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [interviewId]);

  // Check media permissions
  const checkMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Stop the test stream immediately
      stream.getTracks().forEach((track) => track.stop());
      setPermissionsGranted(true);
      return true;
    } catch (err) {
      console.error("Media permissions error:", err);
      setError("Please grant camera and microphone permissions to continue.");
      setPermissionsGranted(false);
      setModalType('permission');
      setIsModalOpen(true);
      return false;
    }
  };

  // Prepare for interview - check permissions and set up preview
  const prepareForInterview = async () => {
    const hasPermissions = await checkMediaPermissions();
    if (hasPermissions) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        mediaStreamRef.current = stream;
        setIsPreparationMode(true);
      } catch (err) {
        console.error("Failed to access media devices:", err);
        setModalType('permission');
        setIsModalOpen(true);
      }
    }
  };

  // Show start interview guide modal
  const handleOpenGuide = () => {
    setModalType('start');
    setIsModalOpen(true);
  };

  // Start the interview after modal confirmation
  const startInterview = async () => {
    setIsModalOpen(false);
    
    if (!mediaStreamRef.current) {
      try {
        // Initialize media stream if not already done
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream;
      } catch (err) {
        console.error("Failed to access media devices:", err);
        setModalType('permission');
        setIsModalOpen(true);
        return;
      }
    }

    // Start the timer
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    setIsInterviewActive(true);
    setCurrentIndex(0);
    setElapsedTime(0);

    // Start recording for the first question
    startRecording();
  };

  // End the entire interview
  const endInterview = () => {
    if (isRecording) {
      stopRecording();
    }

    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop all media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsInterviewActive(false);
    setIsPreparationMode(false);
    setModalType('end');
    setIsModalOpen(true);
  };

  // Upload audio and video to the server
  const uploadMediaToServer = async (audioBlob, videoBlob, questionIndex) => {
    const formData = new FormData();

    // Append audio file
    if (audioBlob) {
      const audioFilename = `audio_${interviewId}_q${questionIndex}.m4a`;
      formData.append("audio", audioBlob, audioFilename);
    }

    // Append video file
    if (videoBlob) {
      const videoFilename = `video_${interviewId}_q${questionIndex}.webm`;
      formData.append("video", videoBlob, videoFilename);
    }

    // Include metadata fields
    formData.append("interviewId", interviewId);
    formData.append("questionIndex", questionIndex);

    try {
      console.log(`Uploading media for question index: ${questionIndex}`);
      await axios.post("http://localhost:8000/api/interview/upload", formData);
      console.log(`Media uploaded successfully for question index: ${questionIndex}`);
    } catch (err) {
      console.error("Failed to upload media:", err);
      const errorMessage = err.response?.data?.message || "Failed to upload media. Please try again.";
      setError(errorMessage);
    }
  };

  // Stop recording for current question and upload media
  const stopRecording = () => {
    if (
      videoRecorderRef.current &&
      videoRecorderRef.current.state === "recording"
    ) {
      videoRecorderRef.current.stop();
    }

    if (
      audioRecorderRef.current &&
      audioRecorderRef.current.state === "recording"
    ) {
      audioRecorderRef.current.stop();
    }

    setIsRecording(false);

    // Handle upload after both recorders stop
    videoRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(videoChunksRef.current, { type: "video/webm" });
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp4" });
      uploadMediaToServer(audioBlob, videoBlob, currentIndex);
    };
  };

  // Start recording for current question
  const startRecording = () => {
    if (!mediaStreamRef.current) return;

    // Set up video recorder with webm format
    const videoRecorderOptions = { mimeType: "video/webm" };
    const videoRecorder = new MediaRecorder(
      mediaStreamRef.current,
      videoRecorderOptions
    );
    videoRecorderRef.current = videoRecorder;
    videoChunksRef.current = [];

    videoRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunksRef.current.push(event.data);
      }
    };

    // Set up audio recorder (using the audio track from the same stream)
    const audioStream = new MediaStream(
      mediaStreamRef.current.getAudioTracks()
    );

    // Check if the browser supports audio/mp4 (M4A) format
    let audioRecorder;

    // Check if audio/mp4 is supported, if not fall back to audio/webm then convert later
    if (MediaRecorder.isTypeSupported("audio/mp4")) {
      audioRecorder = new MediaRecorder(audioStream, { mimeType: "audio/mp4" });
    } else {
      console.warn(
        "audio/mp4 is not supported by this browser, falling back to audio/webm"
      );
      audioRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });
    }

    audioRecorderRef.current = audioRecorder;
    audioChunksRef.current = [];

    audioRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    // Start both recorders with timeslices for more frequent ondataavailable events
    videoRecorder.start(1000); // 1 second timeslices
    audioRecorder.start(1000); // 1 second timeslices
    setIsRecording(true);
  };

  // Navigate to the next question
  const handleNextQuestion = () => {
    if (currentIndex >= questions.length - 1 || !isInterviewActive) return;

    if (isRecording) {
      stopRecording();
    }

    // Small delay to ensure recorders have time to process
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      startRecording(nextIndex);
    }, 500);
  };

  // Navigate to the previous question
  const handlePrevQuestion = () => {
    if (currentIndex <= 0 || !isInterviewActive) return;

    if (isRecording) {
      stopRecording();
    }

    // Small delay to ensure recorders have time to process
    setTimeout(() => {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      startRecording(prevIndex);
    }, 500);
  };

  // Retry loading questions if there was an error
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);

    axios
      .get(`http://localhost:8000/api/interview/${interviewId}`)
      .then((response) => {
        setQuestions(response.data.questions);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch interview questions on retry:", err);
        setError("Failed to load interview questions. Please try again.");
        setIsLoading(false);
      });
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-indigo-700">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !isModalOpen) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">AI Interview</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isInterviewActive && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <Timer seconds={elapsedTime} />
              </div>
            )}
            
            {!isInterviewActive && !isPreparationMode && (
              <button
                onClick={prepareForInterview}
                disabled={!questions.length}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                  questions.length 
                    ? "bg-indigo-600 hover:bg-indigo-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Prepare for Interview
              </button>
            )}
            
            {isPreparationMode && !isInterviewActive && (
              <button
                onClick={handleOpenGuide}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                Start Interview
              </button>
            )}
            
            {isInterviewActive && (
              <button
                onClick={endInterview}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
              >
                End Interview
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Video & Audio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Interview Preview</h2>
                <p className="text-sm text-gray-500">Make sure your camera and microphone are working properly</p>
              </div>

              <div className="p-4">
                <CameraPreview 
                  stream={mediaStreamRef.current} 
                  isActive={isPreparationMode || isInterviewActive} 
                />
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <MicMeter stream={mediaStreamRef.current} />
              </div>
            </div>

            {/* Controls and Tips */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Interview Tips</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Speak Clearly</h3>
                      <p className="mt-1 text-sm text-gray-500">Maintain a clear voice and moderate pace throughout the interview.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Maintain Eye Contact</h3>
                      <p className="mt-1 text-sm text-gray-500">Look directly at the camera to create a connection with interviewers.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Stay Focused</h3>
                      <p className="mt-1 text-sm text-gray-500">Minimize distractions in your environment during the interview.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Be Authentic</h3>
                      <p className="mt-1 text-sm text-gray-500">Show your true personality while maintaining professionalism.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Question and controls */}
          <div className="space-y-6">
            {/* Current Question */}
            <div className="h-64">
              <QuestionCard 
                question={questions[currentIndex]?.question || "No questions available"}
                isActive={isInterviewActive}
                currentIndex={currentIndex + 1}
                totalQuestions={questions.length}
              />
            </div>
            
            {/* Interview Progress */}
            {isInterviewActive && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Interview Progress</h2>
                    <span className="text-sm text-gray-500">{currentIndex + 1}/{questions.length}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div className="bg-indigo-600 h-2.5 rounded-full" 
                         style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between space-x-3">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentIndex === 0}
                      className={`py-3 px-4 text-center font-medium rounded-lg shadow transition duration-150 ${
                        currentIndex > 0
                          ? "bg-gray-600 hover:bg-gray-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Previous
                    </button>
                    
                    <button
                      onClick={handleNextQuestion}
                      disabled={currentIndex >= questions.length - 1}
                      className={`flex-grow py-3 px-4 text-center font-medium rounded-lg shadow transition duration-150 ${
                        currentIndex < questions.length - 1
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About This Interview</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">Job Interview</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Expected Duration: 15-20 minutes</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm text-gray-600">{questions.length} questions total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">© 2025 AI Interview. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">Help</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={() => !isInterviewActive && setIsModalOpen(false)}>
        {modalType === 'start' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Ready to Begin the Interview?</h3>
              <p className="text-sm text-gray-500 mt-2">
                The interview will consist of {questions.length} questions. Your responses will be recorded for later review.
              </p>
            </div>
            <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
              >
                Not yet
              </button>
              <button
                onClick={startInterview}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
              >
                Begin Interview
              </button>
            </div>
          </div>
        )}

        {modalType === 'end' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Interview Completed!</h3>
              <p className="text-sm text-gray-500 mt-2">
                Thank you for completing the interview. Your responses have been recorded successfully.
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {modalType === 'permission' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Camera or Microphone Access Required</h3>
              <p className="text-sm text-gray-500 mt-2">
                Please allow access to your camera and microphone to continue with the interview.
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewPage;