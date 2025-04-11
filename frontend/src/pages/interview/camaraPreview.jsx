import React, { useEffect, useRef } from 'react';

const CameraPreview = ({ stream, isActive }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  return (
    <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
      {isActive ? (
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center text-gray-400 p-6">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p>Camera preview will appear here</p>
          <p className="text-xs mt-2">Click "Start Interview" to begin</p>
        </div>
      )}
    </div>
  );
};

export default CameraPreview;