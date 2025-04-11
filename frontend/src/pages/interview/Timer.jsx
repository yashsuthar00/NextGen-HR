import React from 'react';

const Timer = ({ seconds }) => {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-lg font-mono">
      {formatTime(seconds)}
    </div>
  );
};

export default Timer;