import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  
  // Effect for the subtle mouse-follow animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Redirect to dashboard after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <div 
        className="relative max-w-lg w-full text-center"
        style={{
          transform: `perspective(1000px) rotateX(${position.y * 0.05}deg) rotateY(${position.x * 0.05}deg)`
        }}
      >
        {/* Main visual element with subtle movement */}
        <div className="mb-8 relative">
          <div className="text-9xl font-bold text-indigo-500 opacity-10">404</div>
          <div 
            className="absolute top-0 left-0 right-0 text-9xl font-bold text-indigo-600"
            style={{
              transform: `translateX(${position.x * 0.2}px) translateY(${position.y * 0.2}px)`
            }}
          >
            404
          </div>
        </div>
        
        {/* Message */}
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Action button */}
        {/* <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105">
          Go Back Home
        </button> */}
        
        {/* Visual elements */}
        <div className="mt-16 flex justify-center">
          <div className="w-16 h-16 bg-indigo-200 rounded-full absolute" style={{ left: '20%', transform: `translateX(${position.x * -0.5}px) translateY(${position.y * -0.5}px)` }}></div>
          <div className="w-8 h-8 bg-indigo-300 rounded-full absolute" style={{ right: '25%', top: '70%', transform: `translateX(${position.x * 0.7}px) translateY(${position.y * 0.7}px)` }}></div>
          <div className="w-12 h-12 bg-indigo-400 rounded-full absolute opacity-50" style={{ left: '30%', top: '60%', transform: `translateX(${position.x * 0.3}px) translateY(${position.y * 0.3}px)` }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;