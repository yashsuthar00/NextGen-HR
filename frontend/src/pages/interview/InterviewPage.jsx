import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "./Model";
import CameraPreview from "./camaraPreview";
import MicMeter from "./MicMeter";
import QuestionCard from "./questionCard";
import Timer from "./Timer";
// import { current } from "@reduxjs/toolkit";

const InterviewPage = ({ interviewId }) => {
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [error, setError] = useState(null);
  const [_, setPermissionsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Removed unused tempIndex state

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
      return false;
    }
  };

  // Open the interview guide modal
  const handleOpenGuide = async () => {
    const hasPermissions = await checkMediaPermissions();
    if (hasPermissions) {
      setShowGuideModal(true);
    }
  };

  // Start the interview after modal confirmation
  const startInterview = async () => {
    try {
      // Initialize media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;

      // Start the timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      setIsInterviewActive(true);
      setShowGuideModal(false);

      // Start recording for the first question
      startRecording();
    } catch (err) {
      console.error("Failed to start interview:", err);
      setError(
        "Failed to access camera or microphone. Please check your permissions."
      );
    }
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
  };

  // Start recording for current question
  const startRecording = (currentIndex) => {
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

    // videoRecorder.onstop = () => {
    //   // Save video to localStorage
    //   const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
    //   saveVideoToLocalStorage(videoBlob);
    // };

    // Set up audio recorder (using the audio track from the same stream)
    // For M4A format, we need to use audio/mp4 MIME type
    const audioStream = new MediaStream(
      mediaStreamRef.current.getAudioTracks()
    );

    // Check if the browser supports audio/mp4 (M4A) format
    let audioRecorder;
    let mimeType = "audio/mp4";

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
      mimeType = "audio/webm";
    }

    audioRecorderRef.current = audioRecorder;
    audioChunksRef.current = [];

    audioRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    audioRecorder.onstop = () => {
          // Create blob and upload
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
    
          // Upload audio immediately - if it's not in M4A format we'll need server-side conversion
          if (currentIndex === undefined) {
            currentIndex = -1;
          }
          uploadAudioToServer(audioBlob, mimeType, currentIndex + 1);
        };

    // Start both recorders with timeslices for more frequent ondataavailable events
    videoRecorder.start(1000); // 1 second timeslices
    audioRecorder.start(1000); // 1 second timeslices
    setIsRecording(true);
  };

  // Stop recording for current question
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
  };

  // // Save video to localStorage
  // const saveVideoToLocalStorage = (blob) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(blob);
  //   reader.onloadend = () => {
  //     const base64data = reader.result;
  //     try {
  //       try {
  //         localStorage.setItem(`video_${currentIndex}`, base64data);
  //       } catch (err) {
  //         console.error('Error saving video to localStorage:', err);
  //         if (err.name === 'QuotaExceededError') {
  //           setError('Storage space exceeded. Please clear some space or use a different storage method.');
  //         }
  //       }
  //     } catch (err) {
  //       console.error('Error saving video to localStorage:', err);
  //       // Handle localStorage quota exceeded
  //       if (err.name === 'QuotaExceededError') {
  //         setError('Storage space exceeded. Consider using smaller video sizes.');
  //       }
  //     }
  //   };
  // };

  // Upload audio to server
  const uploadAudioToServer = async (blob, mimeType, questionIndex) => {
      const formData = new FormData();
  
      // If this is a webm file, we need to inform the server it needs conversion
      // const needsConversion = mimeType !== 'audio/mp4';
  
      // Append the file with appropriate extension
      const extension = mimeType === "audio/mp4" ? ".m4a" : ".webm";
      const filename = `audio_${interviewId}_q${questionIndex}${extension}`;
      formData.append("file", blob, filename);
  
      // Include metadata fields
      // formData.append('questionId', questions[questionIndex].id);
      formData.append("interviewId", interviewId);
      formData.append("questionIndex", questionIndex);
      
      // formData.append('needsConversion', needsConversion);
      // formData.append('targetFormat', 'm4a');
  
      try {
        await axios.post("http://localhost:8000/api/interview/upload", formData);
      } catch (err) {
        console.error("Failed to upload audio:", err);
        alert(
          err.response.data.message || "Failed to upload audio. Please try again."
        );
        // Queue for retry - in a production app, implement retry logic here
      }
    };

  // Navigate to the next question
  const handleNextQuestion = () => {
    if (currentIndex >= questions.length - 1 || !isInterviewActive) return;
  
    if (isRecording) {
      stopRecording();
    }
  
    // Small delay to ensure recorders have time to process
    setTimeout(() => {
      const nextIndex = currentIndex + 1; // Calculate the next index
      setCurrentIndex(nextIndex); // Update the state
      startRecording(currentIndex);
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
      setCurrentIndex(currentIndex - 1);
      startRecording();
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">AI Interview</h1>
        </div>

        <div className="flex items-center space-x-4">
          {isInterviewActive && <Timer seconds={elapsedTime} />}

          {!isInterviewActive ? (
            <button
              onClick={handleOpenGuide}
              disabled={!questions.length}
              className={`px-4 py-2 rounded-md ${
                questions.length
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Start Interview
            </button>
          ) : (
            <button
              onClick={endInterview}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              End Interview
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left column - Camera preview */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <CameraPreview
              stream={mediaStreamRef.current}
              isActive={isInterviewActive}
            />

            {isInterviewActive && (
              <div className="p-4 bg-gray-50 border-t">
                <MicMeter stream={mediaStreamRef.current} />
              </div>
            )}
          </div>

          {/* Right column - Question display */}
          <div className="flex flex-col">
            <QuestionCard
              question={
                questions[currentIndex]?.question || "No questions available"
              }
              isActive={isInterviewActive}
              currentIndex={currentIndex + 1}
              totalQuestions={questions.length}
            />

            {/* Navigation controls */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={
                  currentIndex === 0 || !isInterviewActive
                }
                className={`px-4 py-2 rounded-md ${
                  currentIndex > 0 && isInterviewActive 
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Previous Question
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={
                  currentIndex >= questions.length - 1 ||
                  !isInterviewActive 
                }
                className={`px-4 py-2 rounded-md ${
                  currentIndex < questions.length - 1 &&
                  isInterviewActive 
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next Question
              </button>
            </div>

            
          </div>
        </div>
      </main>

      {/* Interview guide modal */}
      <Modal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Interview Guide</h2>
          <div className="mb-6">
            <p className="mb-3">
              You will see one question at a time. Take a moment to think, then
              respond naturally as if you were in a real interview.
            </p>
            <h3 className="font-medium mb-2">
              Tips for a successful interview:
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure you're in a well-lit, quiet environment</li>
              <li>Speak clearly and at a moderate pace</li>
              <li>Aim to keep responses between 1-3 minutes per question</li>
              <li>Use the navigation buttons to move between questions</li>
              <li>Your interview will be automatically recorded</li>
            </ul>
          </div>
          <div className="flex justify-end">
            <button
              onClick={startInterview}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Begin Interview
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterviewPage;
