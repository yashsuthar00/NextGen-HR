import React from 'react';
import JobCard from './JobCard';

const JobList = ({ jobs, userRole, onApply }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {jobs.map((job) => (
        <JobCard 
          key={job._id} 
          job={job} 
          userRole={userRole} 
          onApply={() => onApply(job)} 
        />
      ))}
    </div>
  );
};

export default JobList;