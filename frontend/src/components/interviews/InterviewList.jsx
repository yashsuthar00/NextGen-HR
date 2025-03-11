import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { hasPermission } from '../../utils/permissions';

const InterviewList = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/interviews', {
          params: { filter, search: searchTerm }
        });
        setInterviews(response.data);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to load interviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [filter, searchTerm]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateInterview = () => {
    router.push('/interviews/new');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Interviews</h1>
        
        <div className="flex flex-col md:flex-row mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <select
            className="py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">All Interviews</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          {hasPermission(user, 'CREATE_INTERVIEW') && (
            <button
              onClick={handleCreateInterview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Interview
            </button>
          )}
        </div>
      </div>
      
      {interviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No interviews found</h3>
            <p className="mt-1 text-gray-500">
              {filter !== 'all' 
                ? `No ${filter} interviews found.` 
                : searchTerm 
                  ? `No interviews match "${searchTerm}".` 
                  : 'There are no interviews to display.'}
            </p>
            {hasPermission(user, 'CREATE_INTERVIEW') && (
              <div className="mt-6">
                <button
                  onClick={handleCreateInterview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Create New Interview
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {user.role === 'recruiter' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                  )}
                  {(user.role === 'candidate' || user.role === 'admin') && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recruiter
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled For
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-gray-50">
                    {user.role === 'recruiter' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-bold">
                              {interview.candidateName.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                            <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    {(user.role === 'candidate' || user.role === 'admin') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="bg-green-100 text-green-800 rounded-full h-10 w-10 flex items-center justify-center font-bold">
                              {interview.recruiterName.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{interview.recruiterName}</div>
                            <div className="text-sm text-gray-500">{interview.recruiterEmail}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.position}</div>
                      <div className="text-sm text-gray-500">{interview.company || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(interview.scheduledAt)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(interview.scheduledAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(interview.status)}`}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/interviews/${interview.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      
                      {interview.status === 'scheduled' && (
                        <>
                          {hasPermission(user, 'EDIT_INTERVIEW') && (
                            <button
                              onClick={() => router.push(`/interviews/${interview.id}/edit`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                          )}
                          
                          <button
                            onClick={() => router.push(`/interviews/${interview.id}/join`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Join
                          </button>
                        </>
                      )}
                      
                      {interview.status === 'in-progress' && (
                        <button
                          onClick={() => router.push(`/interviews/${interview.id}/join`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Resume
                        </button>
                      )}
                      
                      {hasPermission(user, 'DELETE_INTERVIEW') && interview.status !== 'completed' && (
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to cancel this interview?')) {
                              // Call API to cancel interview
                              axios.patch(`/api/interviews/${interview.id}/cancel`)
                                .then(() => {
                                  // Refresh interview list
                                  setInterviews(prevInterviews => prevInterviews.map(i => 
                                    i.id === interview.id ? { ...i, status: 'cancelled' } : i
                                  ));
                                })
                                .catch(err => {
                                  console.error('Error cancelling interview:', err);
                                  setError('Failed to cancel interview. Please try again.');
                                });
                            }
                          }}
                          className="text-red-600 hover:text-red-900 ml-3"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewList;