import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    upcomingInterviews: 0,
    completedInterviews: 0,
    pendingFeedback: 0
  });
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace with actual API endpoints
        const [statsResponse, interviewsResponse] = await Promise.all([
          axios.get('/api/candidate/stats'),
          axios.get('/api/candidate/interviews')
        ]);
        
        setStats(statsResponse.data);
        setInterviews(interviewsResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Candidate Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Total Interviews</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-gray-800">{stats.totalInterviews}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Upcoming</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-blue-600">{stats.upcomingInterviews}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Completed</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-green-600">{stats.completedInterviews}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Awaiting Feedback</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-orange-600">{stats.pendingFeedback}</div>
          </div>
        </div>
      </div>
      
      {/* Interview List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">My Interviews</h2>
        
        {interviews.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No interviews scheduled</h3>
            <p className="mt-1 text-gray-500">You don't have any interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Position</th>
                  <th className="py-3 px-6 text-left">Recruiter</th>
                  <th className="py-3 px-6 text-left">Date & Time</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {interviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">{interview.position}</td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <div className="bg-green-200 text-green-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                            {interview.recruiterName.charAt(0)}
                          </div>
                        </div>
                        <span>{interview.recruiterName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {new Date(interview.scheduledAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        interview.status === 'scheduled' ? 'bg-yellow-200 text-yellow-800' :
                        interview.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                        interview.status === 'completed' ? 'bg-green-200 text-green-800' : 
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button 
                          onClick={() => router.push(`/interviews/${interview.id}`)}
                          className="transform hover:text-blue-500 hover:scale-110 mr-3"
                          title="View details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {interview.status === 'scheduled' && (
                          <button 
                            onClick={() => router.push(`/interviews/${interview.id}/join`)}
                            className="transform hover:text-green-500 hover:scale-110"
                            title="Join interview"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Feedback Section */}
      {stats.completedInterviews > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Feedback</h2>
          
          {/* Feedback would be displayed here */}
          <div className="text-center py-4 text-gray-500">
            <p>Feedback information will appear here after interviews are completed and evaluated.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;