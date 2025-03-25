import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, ChevronRight, Info, X } from 'lucide-react';
import styled from 'styled-components';

// Styled Components
const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  color: #1f2937;
  line-height: 1.5;
`;

const InterviewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const VideoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const VideoContainer = styled.div`
  position: relative;
  background-color: #000;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 16 / 9;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RecordingIndicator = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const RecordingTime = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &.active {
    background-color: #4f46e5;
    color: white;
    border-color: #4f46e5;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProgressIndicator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
`;

const ProgressFilled = styled.div`
  height: 100%;
  background-color: #4f46e5;
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
`;

const QuestionCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuestionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #6b7280;
`;

const QuestionText = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.6;
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: auto;
  
  &:hover {
    background-color: #4338ca;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RecordingsSummary = styled.div`
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const RecordingsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const RecordingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecordingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const RecordingLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DownloadLink = styled.a`
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4338ca;
    text-decoration: underline;
  }
  
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

// Guide Popup Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const StepList = styled.ol`
  padding-left: 1.5rem;
  margin: 1rem 0;
`;

const Step = styled.li`
  margin-bottom: 0.75rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  
  &:hover {
    color: #1f2937;
  }
`;

const ConfirmButton = styled.button`
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  
  &:hover {
    background-color: #4338ca;
  }
`;

function InterviewPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlobs, setAudioBlobs] = useState([]);
  const [videoBlobs, setVideoBlobs] = useState([]);
  const [showGuide, setShowGuide] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  
  // Sample questions - in a real app, these would come from an API
  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and how do they help you succeed?",
    "Describe a challenging situation you faced and how you overcame it.",
    "Why are you interested in this position?",
    "Where do you see yourself in five years?",
  ];

  // Start media stream when guide is dismissed
  useEffect(() => {
    if (!showGuide) {
      setupCamera();
    }
    
    return () => {
      // Clean up
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [showGuide]);
  
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setIsCameraReady(true);
      
      // Speak the first question after camera is ready
      speakQuestion(questions[0]);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Please allow camera and microphone access to use this application.");
    }
  };
  
  const speakQuestion = (question) => {
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  
  const startRecording = () => {
    if (!streamRef.current) return;
    
    // Video recorder
    const videoRecorder = new MediaRecorder(streamRef.current);
    const videoChunks = [];
    
    videoRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunks.push(event.data);
      }
    };
    
    videoRecorder.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
      setVideoBlobs(prev => [...prev, videoBlob]);
    };
    
    // Audio recorder (separate)
    const audioStream = new MediaStream(streamRef.current.getAudioTracks());
    const audioRecorder = new MediaRecorder(audioStream);
    const audioChunks = [];
    
    audioRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    audioRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      setAudioBlobs(prev => [...prev, audioBlob]);
    };
    
    // Start both recorders
    videoRecorder.start();
    audioRecorder.start();
    
    // Store references
    mediaRecorderRef.current = videoRecorder;
    audioRecorderRef.current = audioRecorder;
    
    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && audioRecorderRef.current) {
      mediaRecorderRef.current.stop();
      audioRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingTime(0);
    }
  };
  
  const handleNextQuestion = () => {
    // Stop current recording
    if (isRecording) {
      stopRecording();
    }
    
    // Move to next question if available
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      speakQuestion(questions[nextIndex]);
      
      // Short delay before starting new recording
      setTimeout(() => {
        startRecording();
      }, 1000);
    } else {
      // Interview completed
      alert("Interview completed! Recordings have been saved.");
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleGuideConfirm = () => {
    setShowGuide(false);
  };
  
  return (
    <AppContainer>
      {/* Pre-Interview Guide/Popup */}
      {showGuide && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleGuideConfirm}>
              <X size={18} />
            </CloseButton>
            
            <ModalHeader>
              <Info size={24} color="#4f46e5" />
              <ModalTitle>Welcome to the AI Interview</ModalTitle>
            </ModalHeader>
            
            <ModalBody>
              <p>Before we begin, here's a quick guide on how this works:</p>
              
              <StepList>
                <Step>The AI will ask you questions that will be displayed on screen and spoken out loud.</Step>
                <Step>You'll need to allow camera and microphone access when prompted.</Step>
                <Step>Click "Start Recording" to begin recording your answer.</Step>
                <Step>When finished, click "Next Question" to proceed to the next question.</Step>
                <Step>Your responses will be recorded in separate audio and video files for each question.</Step>
                <Step>After completing all questions, you can download your recordings.</Step>
              </StepList>
              
              <p>Ready to start your interview? Click the button below to continue.</p>
            </ModalBody>
            
            <ConfirmButton onClick={handleGuideConfirm}>
              I'm Ready to Begin
            </ConfirmButton>
          </ModalContent>
        </ModalOverlay>
      )}
      
      <InterviewContainer>
        <VideoSection>
          <VideoContainer>
            <VideoPreview ref={videoRef} autoPlay muted playsInline />
            {isRecording && <RecordingIndicator>● REC</RecordingIndicator>}
            <RecordingTime>{formatTime(recordingTime)}</RecordingTime>
          </VideoContainer>
          
          <Controls>
            <ControlButton 
              className={isRecording ? 'active' : ''}
              onClick={toggleRecording}
              disabled={!isCameraReady}
            >
              {isRecording ? <VideoOff size={20} /> : <Video size={20} />}
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </ControlButton>
            
            <ControlButton 
              className="mic-button"
              disabled={!isRecording}
            >
              {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
              <span>Audio {isRecording ? 'On' : 'Off'}</span>
            </ControlButton>
          </Controls>
        </VideoSection>
        
        <QuestionSection>
          <ProgressIndicator>
            <ProgressText>
              Question {currentQuestionIndex + 1} of {questions.length}
            </ProgressText>
            <ProgressBar>
              <ProgressFilled percentage={((currentQuestionIndex + 1) / questions.length) * 100} />
            </ProgressBar>
          </ProgressIndicator>
          
          <QuestionCard>
            <QuestionTitle>Question:</QuestionTitle>
            <QuestionText>{questions[currentQuestionIndex]}</QuestionText>
          </QuestionCard>
          
          <NextButton 
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex >= questions.length - 1 && !isRecording}
          >
            {currentQuestionIndex >= questions.length - 1 ? 'Finish Interview' : 'Next Question'}
            <ChevronRight size={20} />
          </NextButton>
        </QuestionSection>
      </InterviewContainer>
      
      <RecordingsSummary>
        <RecordingsTitle>Recordings</RecordingsTitle>
        <RecordingsList>
          {videoBlobs.map((blob, index) => (
            <RecordingItem key={index}>
              <span>Recording {index + 1}</span>
              <RecordingLinks>
                <DownloadLink 
                  href={URL.createObjectURL(blob)} 
                  download={`interview-video-${index + 1}.webm`}
                >
                  Download Video
                </DownloadLink>
                <DownloadLink 
                  href={audioBlobs[index] ? URL.createObjectURL(audioBlobs[index]) : '#'} 
                  download={`interview-audio-${index + 1}.webm`}
                  disabled={!audioBlobs[index]}
                >
                  Download Audio
                </DownloadLink>
              </RecordingLinks>
            </RecordingItem>
          ))}
        </RecordingsList>
      </RecordingsSummary>
    </AppContainer>
  );
}

export default InterviewPage;