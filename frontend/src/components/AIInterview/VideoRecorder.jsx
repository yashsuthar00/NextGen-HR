import React, { useEffect, useRef, useState } from 'react';
import { useInterview } from '../../context/InterviewContext';
import recordingService from '../../services/recordingService';
import uploadManager from '../../services/uploadService';

const VideoRecorder = ({ questionId, onRecordingComplete }) => {
  const videoRef = useRef(null);
  const { state, actions } = useInterview();
  const [status, setStatus] = useState('initializing'); // initializing, ready, recording, processing, error
  const [countdown, setCountdown] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  
  // Initialize the recording service
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        setStatus('initializing');
        const result = await recordingService.initialize(videoRef.current);
        
        if (result.success) {
          setStatus('ready');
        } else {
          setError(result.error || 'Failed to initialize camera');
          setStatus('error');
        }
      } catch (err) {
        console.error('Camera initialization error:', err);
        setError('Could not access camera or microphone. Please ensure you have granted the necessary permissions.');
        setStatus('error');
      }
    };
    
    initializeCamera();
    
    // Cleanup function
    return () => {
      recordingService.releaseStream();
      clearInterval(timerRef.current);
    };
  }, []);
  
  // Start recording with countdown
  const startRecording = () => {
    setCountdown(3); // 3 second countdown
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Actually start recording after countdown
          beginRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Begin the actual recording
  const beginRecording = () => {
    try {
      // Start the recording
      recordingService.startRecording();
      actions.startRecording();
      setStatus('recording');
      
      // Start the timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording. Please refresh and try again.');
      setStatus('error');
    }
  };
  
  // Stop recording and prepare for upload
  const stopRecording = async () => {
    try {
      // Clear the timer
      clearInterval(timerRef.current);
      
      // Stop recording and get the video blob
      setStatus('processing');
      const videoBlob = await recordingService.stopRecording();
      actions.stopRecording();
      
      // Create response ID
      const responseId = `${state.interviewId}_${questionId}_${Date.now()}`;
      
      // Create response metadata
      const responseMetadata = {
        responseId,
        interviewId: state.interviewId,
        candidateId: state.candidateId,
        questionId,
        questionIndex: state.currentQuestionIndex,
        timestamp: new Date().toISOString(),
        duration: recordingTime
      };
      
      // Add response to state
      actions.addResponse(responseMetadata);
      
      // Add to upload queue
      const uploadItem = {
        responseId,
        videoBlob,
        metadata: responseMetadata
      };
      
      // Add to upload queue in context
      actions.addToUploadQueue(uploadItem);
      
      // Use upload manager to handle the upload
      uploadManager.addToQueue(
        videoBlob,
        responseMetadata,
        (id, progress) => {
          // Update progress in context
          actions.updateUploadProgress(id, progress);
        },
        (id, result) => {
          // Mark upload as complete in context
          actions.completeUpload(id);
          
          // Call the completion callback
          onRecordingComplete();
        },
        (id, error) => {
          // Handle upload error
          console.error('Upload error:', error);
          actions.setError(`Failed to upload response: ${error.message}`);
        }
      );
      
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to process the recording. Please try again.');
      setStatus('error');
    }
  };
  
  // Format time display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Render based on current status
  const renderContent = () => {
    switch (status) {
      case 'initializing':
        return (
          <div className="text-center py-8">
            <div className="spinner mb-4">Loading...</div>
            <p>Initializing camera...</p>
          </div>
        );
        
      case 'ready':
        return (
          <div className="text-center py-8">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium"
              onClick={startRecording}
            >
              Start Recording
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Click when you're ready to begin
            </p>
          </div>
        );
        
      case 'recording':
        return (
          <div className="text-center py-4">
            <div className="recording-indicator mb-2">
              <span className="inline-block h-4 w-4 bg-red-500 rounded-full animate-pulse mr-2"></span>
              Recording: {formatTime(recordingTime)}
            </div>
            <button
              className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-medium"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
          </div>
        );
        
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="spinner mb-4">Processing...</div>
            <p>Processing your response...</p>
          </div>
        );
        
      case 'error':
        return (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">Error</div>
            <p>{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="mt-6">
      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
        {/* Video preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${status === 'recording' ? 'border-4 border-red-500' : ''}`}
        />
        
        {/* Countdown overlay */}
        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-8xl font-bold animate-pulse">
              {countdown}
            </div>
          </div>
        )}
      </div>
      
      {/* Controls and status */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default VideoRecorder;