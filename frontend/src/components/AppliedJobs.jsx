// src/components/AppliedJobs.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        // Get auth token from localStorage
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('Authentication token not found');
        }

        // Parse the token to get userId
        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        const userId = tokenData.id;
        console.log('User ID:', userId);

        // Fetch interview documents
        const interviewResponse = await axios.get(`/api/interviews/user/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        // Process each interview document
        const jobDetailsPromises = interviewResponse.data.map(async (interview) => {
          // Fetch job details using jobId
          const jobResponse = await axios.get(`/api/jobs/${interview.jobId.$oid}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });

          return {
            interviewId: interview._id,
            jobId: interview.jobId.$oid,
            jobTitle: jobResponse.data.title,
            companyName: jobResponse.data.companyName,
            status: interview.status,
            questions: interview.questions
          };
        });

        const jobsWithDetails = await Promise.all(jobDetailsPromises);
        setAppliedJobs(jobsWithDetails);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 my-4">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applied Jobs</h1>
      
      {appliedJobs.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-600">You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.map((job) => (
            <div key={job.interviewId} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.jobTitle}</h2>
                <p className="text-gray-600 mb-4">{job.companyName}</p>
                
                <div className="flex items-center mb-4">
                  <span className="text-sm font-medium mr-2">Status:</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    job.status === 'scheduled' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : job.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-end">
                  {job.status === 'scheduled' && (
                    <Link 
                      to={`/interview/${job.interviewId}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                    >
                      Start Interview
                    </Link>
                  )}
                  
                  {job.status === 'completed' && (
                    <button 
                      className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-md cursor-not-allowed"
                      disabled
                    >
                      Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppliedJobs;