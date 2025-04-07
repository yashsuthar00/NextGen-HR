import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import ApplyForm from '../components/ApplyForm';
import { PlusIcon } from 'lucide-react';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user role from token
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setUserRole(null);
      }
    }

    // Fetch jobs
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await api.post(
        '/jobs', 
        jobData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setJobs([...jobs, response.data]);
      setShowJobForm(false);
    } catch (err) {
      console.error("Failed to create job:", err);
      alert("Failed to create job posting. Please try again.");
    }
  };

  const handleApplyJob = async (applicationData, jobId) => {
    try {
      const formData = new FormData();
      formData.append('name', applicationData.name);
      formData.append('email', applicationData.email);
      formData.append('resume', applicationData.resume);
      formData.append('jobId', jobId);

      const authToken = localStorage.getItem('authToken');
      await api.post(
        '/jobs/apply', 
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      alert("Application submitted successfully!");
      setShowApplyForm(false);
      setSelectedJob(null);
    } catch (err) {
      console.error("Failed to submit application:", err);
      alert("Failed to submit application. Please try again.");
    }
  };

  const openApplyForm = (job) => {
    setSelectedJob(job);
    setShowApplyForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Job Openings</h1>
        
        {userRole === 'hr' && (
          <button 
            onClick={() => setShowJobForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Post New Job
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No job openings available at the moment</h3>
          {userRole === 'hr' && (
            <p className="mt-2 text-gray-500">Click "Post New Job" to create your first job posting.</p>
          )}
        </div>
      ) : (
        <JobList 
          jobs={jobs} 
          userRole={userRole} 
          onApply={openApplyForm} 
        />
      )}

      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create New Job</h2>
              <button 
                onClick={() => setShowJobForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <JobForm onSubmit={handleCreateJob} onCancel={() => setShowJobForm(false)} />
          </div>
        </div>
      )}

      {showApplyForm && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Apply for {selectedJob.title}</h2>
              <button 
                onClick={() => {
                  setShowApplyForm(false);
                  setSelectedJob(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <ApplyForm 
              onSubmit={(data) => handleApplyJob(data, selectedJob._id)} 
              onCancel={() => {
                setShowApplyForm(false);
                setSelectedJob(null);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListPage;