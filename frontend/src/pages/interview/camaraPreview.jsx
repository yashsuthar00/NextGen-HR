import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Zap } from 'lucide-react';

const CameraPreview = ({ stream, isActive }) => {
  const videoRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isDetectingFace, setIsDetectingFace] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      
      // Simulate AI face detection on stream start
      if (isActive) {
        setIsDetectingFace(true);
        const timeout = setTimeout(() => {
          setIsDetectingFace(false);
          setFaceDetected(true);
          
          // After face detection, simulate AI ready state
          setTimeout(() => {
            setAiReady(true);
          }, 1500);
        }, 2500);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [stream, isActive]);
  
  return (
    <div className="relative aspect-video bg-slate-900 overflow-hidden rounded-lg">
      {isActive ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className="w-full h-full object-cover"
          />
          
          {/* Camera controls */}
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
              <Video size={16} />
            </button>
            <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
              <Mic size={16} />
            </button>
          </div>
          
          {/* AI interface elements */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs">
              <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>Recording Active</span>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs flex items-center">
              <Zap size={14} className="text-yellow-400 mr-1.5" />
              <span>AI Interview Mode</span>
            </div>
          </div>
          
          {/* Face detection overlay */}
          {isDetectingFace && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
              <div className="w-32 h-32 border-2 border-dashed border-blue-400 rounded-full animate-pulse flex items-center justify-center">
                <Camera size={32} className="text-blue-400" />
              </div>
              <p className="mt-4 text-sm font-medium">Detecting face...</p>
              <div className="mt-2 w-32 bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-progressBar"></div>
              </div>
            </div>
          )}
          
          {/* When face is detected but AI not ready yet */}
          {faceDetected && !aiReady && !isDetectingFace && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
              <div className="w-32 h-32 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-blue-300 rounded-full flex items-center justify-center animate-ping-slow">
                  <Camera size={32} className="text-blue-400" />
                </div>
              </div>
              <p className="mt-4 text-sm font-medium">Face detected! Initializing AI...</p>
              <div className="mt-2 flex space-x-1.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce animation-delay-150"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce animation-delay-300"></span>
              </div>
            </div>
          )}
          
          {/* AI-powered camera interface elements */}
          {faceDetected && aiReady && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400"></div>
              
              {/* AI status indicators */}
              <div className="absolute bottom-14 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-white">AI Assistant Active</span>
                  </div>
                  <div className="text-xs text-blue-300">Face Tracking: Optimal</div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Camera Preview</h3>
          <p className="text-center text-sm mb-4">You'll need to allow access to your camera and microphone to participate in the interview.</p>
          <div className="flex flex-col space-y-2 w-full max-w-xs">
            <div className="bg-slate-800 p-3 rounded-lg flex items-center">
              <Camera size={18} className="mr-2 text-blue-400" />
              <span className="text-sm">Camera access required</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg flex items-center">
              <Mic size={18} className="mr-2 text-blue-400" />
              <span className="text-sm">Microphone access required</span>
            </div>
          </div>
          <button className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
            Prepare for Interview
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes progressBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progressBar {
          animation: progressBar 2.5s linear;
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default CameraPreview;