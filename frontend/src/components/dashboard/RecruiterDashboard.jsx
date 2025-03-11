import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    scheduledInterviews: 0,
    completedInterviews: 0,
    pendingReviews: 0
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // You would replace these with your actual API endpoints
        const [statsResponse, interviewsResponse] = await Promise.all([
          axios.get('/api/recruiter/stats'),
          axios.get('/api/recruiter/upcoming-interviews')
        ]);
        
        setStats(statsResponse.data);
        setUpcomingInterviews(interviewsResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateInterview = () => {
    router.push('/interviews/new');
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
        <button
          onClick={handleCreateInterview}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Interview
        </button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Total Interviews</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-gray-800">{stats.totalInterviews}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Scheduled</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-blue-600">{stats.scheduledInterviews}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Completed</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-green-600">{stats.completedInterviews}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500">Pending Reviews</h2>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold text-orange-600">{stats.pendingReviews}</div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Interviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Interviews</h2>
        
        {upcomingInterviews.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming interviews</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new interview.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateInterview}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Create New Interview
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Candidate</th>
                  <th className="py-3 px-6 text-left">Position</th>
                  <th className="py-3 px-6 text-left">Date & Time</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {upcomingInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <div className="bg-blue-200 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                            {interview.candidateName.charAt(0)}
                          </div>
                        </div>
                        <span>{interview.candidateName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">{interview.position}</td>
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
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          className="transform hover:text-blue-500 hover:scale-110 mr-3"
                          onClick={() => router.push(`/interviews/${interview.id}/edit`)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;