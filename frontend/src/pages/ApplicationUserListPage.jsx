import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  UserIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ChevronDownIcon, 
  SearchIcon, 
  FilterIcon, 
  ArrowUpIcon, 
  ArrowDownIcon 
} from 'lucide-react';

const ApplicationUserListPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'score'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc', 'desc'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch job details
        const jobResponse = await api.get(`/jobs/${jobId}`);
        setJobDetails(jobResponse.data);
        
        // Fetch interview data for this job
        const interviewResponse = await api.get(`/interview/job/${jobId}`);
        const interviewData = interviewResponse.data;

        if (!interviewData || interviewData.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }

        // Get all unique user IDs
        const userIds = interviewData.map(interview => interview.userId.$oid || interview.userId);
        
        // Get user details for all users
        const usersPromises = userIds.map(userId => api.get(`/users/${userId}`));
        const usersResponses = await Promise.all(usersPromises);
        const usersData = usersResponses.map(response => response.data);
        console.log("Users Data:", usersData);
        
        // Combine interview data with user data
        const combinedData = interviewData.map(interview => {
          const userId = interview.userId.$oid || interview.userId;
          const user = usersData.find(u => (u._id.$oid || u._id) === userId);
          console.log("User:", user);
          
          return {
            interviewId: interview._id.$oid || interview._id,
            userId: userId,
            status: interview.status,
            jobId: interview.jobId.$oid || interview.jobId,
            createdAt: interview.createdAt || new Date().toISOString(),
            averageScore: interview.averageScore || 0,
            user: user ? {
              fullname: user.fullname,
              email: user.email,
              username: user.username
            } : {
              fullname: "Unknown User",
              email: "unknown@example.com",
              username: "unknown"
            }
          };
        });
        
        setApplications(combinedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load application data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.user.fullname.localeCompare(b.user.fullname)
        : b.user.fullname.localeCompare(a.user.fullname);
    }
    
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    
    if (sortBy === 'score') {
      return sortDirection === 'asc' 
        ? (a.averageScore || 0) - (b.averageScore || 0)
        : (b.averageScore || 0) - (a.averageScore || 0);
    }
    
    return 0;
  });

  // Calculate summary statistics
  const stats = {
    total: applications.length,
    completed: applications.filter(app => app.status === 'completed').length,
    scheduled: applications.filter(app => app.status === 'scheduled').length
  };

  // Toggle sort direction
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // View interview details
  const viewInterview = (interviewId) => {
    navigate(`/interview/report/${interviewId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Job Applications
              </h1>
              {jobDetails && (
                <p className="text-blue-600 font-medium mt-1">{jobDetails.title}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Viewing all applications for this position
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <div className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg">
                <UserIcon className="w-4 h-4 mr-1" /> 
                <span>{stats.total} Total</span>
              </div>
              <div className="flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-lg">
                <CheckCircleIcon className="w-4 h-4 mr-1" /> 
                <span>{stats.completed} Completed</span>
              </div>
              <div className="flex items-center bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg">
                <ClockIcon className="w-4 h-4 mr-1" /> 
                <span>{stats.scheduled} Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email or username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy(field);
                    setSortDirection(direction);
                  }}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="date-desc">Date (Newest)</option>
                  <option value="score-desc">Score (High-Low)</option>
                  <option value="score-asc">Score (Low-High)</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Application List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p>{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <UserIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || statusFilter !== 'all' 
                ? "Try changing your search criteria or filters"
                : "There are no applications for this job yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        <span>Applicant</span>
                        {sortBy === 'name' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon className="ml-1 h-4 w-4" /> : 
                            <ArrowDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        <span>Application Date</span>
                        {sortBy === 'date' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon className="ml-1 h-4 w-4" /> : 
                            <ArrowDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center">
                        <span>Score</span>
                        {sortBy === 'score' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon className="ml-1 h-4 w-4" /> : 
                            <ArrowDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
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
                  {sortedApplications.map((application) => (
                    <tr 
                      key={application.interviewId} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-medium text-blue-600">
                              {application.user.fullname.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.user.fullname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.status === 'completed' ? (
                          <div className="text-sm font-medium text-gray-900">
                            {application.averageScore ? (
                              <div className="flex items-center">
                                <span 
                                  className={`${
                                    application.averageScore >= 80 ? 'text-green-600' : 
                                    application.averageScore >= 60 ? 'text-blue-600' :
                                    'text-yellow-600'
                                  }`}
                                >
                                  {application.averageScore}/100
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500">No score</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Pending interview</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.status === 'completed' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Scheduled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => viewInterview(application.interviewId)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationUserListPage;
