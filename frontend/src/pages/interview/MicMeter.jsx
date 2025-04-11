import React, { useEffect, useRef, useState } from 'react';

const MicMeter = ({ stream }) => {
  const [volume, setVolume] = useState(0);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  
  useEffect(() => {
    if (!stream) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    audioSource.connect(analyser);
    
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    
    const updateVolume = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Calculate average volume
      const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / 
                    dataArrayRef.current.length;
      
      // Normalize to 0-100
      const normalizedVolume = Math.min(100, Math.max(0, average * 2));
      setVolume(normalizedVolume);
      
      animationRef.current = requestAnimationFrame(updateVolume);
    };
    
    updateVolume();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [stream]);
  
  return (
    <div className="flex items-center space-x-3">
      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-green-500 h-full rounded-full transition-all duration-100 ease-out"
          style={{ width: `${volume}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MicMeter;