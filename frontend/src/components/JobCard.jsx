import React, { useState, useRef } from 'react';

const JobCard = ({ job, userRole, onApply }) => {
  const [expanded, setExpanded] = useState(false);
  const descriptionRef = useRef(null);
  
  // Function to check if description is overflowing
  const isOverflowing = () => {
    const element = descriptionRef.current;
    if (!element) return false;
    return element.scrollHeight > 120; // 120px is the collapsed height
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{job.title}</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-1">Eligibility:</h3>
          <p className="text-gray-600">{job.eligibility}</p>
        </div>
        
        <div className="mb-5">
          <h3 className="text-lg font-medium text-gray-700 mb-1">Description:</h3>
          <div className={`relative ${expanded ? 'max-h-96' : 'max-h-32'}`}>
            <div 
              ref={descriptionRef} 
              className={`text-gray-600 whitespace-pre-line ${expanded ? 'overflow-y-auto pr-2' : 'overflow-hidden'}`}
              style={{ maxHeight: expanded ? '24rem' : '8rem' }} // 384px when expanded, 128px when collapsed
            >
              {job.description}
            </div>
            
            {!expanded && isOverflowing() && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          
          {isOverflowing() && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
        
        {userRole === 'candidate' && (
          <div className="flex justify-end mt-4">
            <button
              onClick={onApply}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-300 text-sm shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Apply Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;