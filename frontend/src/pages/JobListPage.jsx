import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import { PlusIcon, BriefcaseIcon, SearchIcon, FilterIcon } from 'lucide-react';
import styled from 'styled-components';

// Styled components
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(3px);
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 650px;
  padding: 2rem;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Enhanced JobCard Component with View Details functionality
const JobCard = ({ job, onApply, onViewDetails, userRole, applicationStats }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Format description text by preserving newlines
  const formatDescription = (text) => {
    if (!text) return '';
    
    // Split by newline characters and return as JSX with line breaks
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Calculate if the description is long enough to truncate
  const isLongDescription = job.description && job.description.length > 250;
  
  // Get a truncated version of the description for preview
  const truncatedDescription = job.description && job.description.length > 250 
    ? job.description.substring(0, 250) + '...' 
    : job.description;

  const navigateToApplicationList = (jobId) => {
    window.location.href = `/application/user/${jobId}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              <p className="text-gray-500 text-sm mt-1">Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
            Full Time
          </div>
        </div>
        
        {/* Application Statistics for HR Users */}
        {userRole === 'hr' && applicationStats && (
          <div className="mt-4 bg-gray-50 p-3 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Application Statistics</h4>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigateToApplicationList(job._id)}
                className="flex items-center"
              >
                <div className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full mr-2">
                  {applicationStats[job._id]?.total || 0}
                </div>
                <span className="text-sm text-gray-600">Total Applications</span>
              </button>
              <button 
                onClick={() => navigateToApplicationList(job._id)}
                className="flex items-center"
              >
                <div className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2 py-1 rounded-full mr-2">
                  {applicationStats[job._id]?.scheduled || 0}
                </div>
                <span className="text-sm text-gray-600">Pending Interviews</span>
              </button>
              <button 
                onClick={() => navigateToApplicationList(job._id)}
                className="flex items-center"
              >
                <div className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full mr-2">
                  {applicationStats[job._id]?.completed || 0}
                </div>
                <span className="text-sm text-gray-600">Completed</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700">Eligibility</h4>
          <p className="text-gray-600 mt-1">{job.eligibility}</p>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700">Description</h4>
          <div className="text-gray-600 mt-1 prose max-w-none">
            {/* Description with conditional rendering */}
            <div className={`overflow-hidden ${!showFullDescription && isLongDescription ? 'max-h-24' : ''}`}>
              {formatDescription(showFullDescription ? job.description : truncatedDescription)}
            </div>
            
            {/* Read More / Show Less toggle for in-card expansion */}
            {isLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 focus:outline-none inline-flex items-center"
              >
                {showFullDescription ? (
                  <>
                    Show Less
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => onViewDetails(job)}
            className="text-blue-600 hover:text-blue-800 underline flex items-center"
          >
            View Full Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <button
            onClick={() => onApply(job)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition-colors duration-300 flex items-center"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

// JobList Component
const JobList = ({ jobs, userRole, onApply, applicationStats }) => {
  return (
    <div className="grid grid-cols-1 gap-8">
      {jobs.map((job) => (
        <JobCard 
          key={job._id} 
          job={job} 
          userRole={userRole} 
          onApply={() => onApply(job)} 
          applicationStats={applicationStats}
        />
      ))}
    </div>
  );
};

// JobForm Component
const JobForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (!formData.eligibility.trim()) {
      newErrors.eligibility = 'Eligibility criteria is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="e.g. Senior Frontend Developer"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="eligibility" className="block text-gray-700 font-medium mb-2">
          Eligibility <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="eligibility"
          name="eligibility"
          value={formData.eligibility}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.eligibility ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="e.g. 3+ years experience, Bachelor's degree"
        />
        {errors.eligibility && (
          <p className="text-red-500 text-sm mt-1">{errors.eligibility}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="6"
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Provide a detailed description of the job..."
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-300 shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

// ApplyForm Component
const ApplyForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'resume' && files && files[0]) {
      setFormData({
        ...formData,
        resume: files[0]
      });
      setFileName(files[0].name);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="resume" className="block text-gray-700 font-medium mb-2">
          Resume <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center w-full">
          <label 
            className="flex-1 flex items-center px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-300"
          >
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="text-gray-500">{fileName || 'Choose your resume file'}</span>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, resume: null });
              setFileName('');
            }}
            className={`ml-2 px-3 py-2 text-gray-500 hover:text-gray-700 ${!fileName ? 'hidden' : ''}`}
          >
            ✕
          </button>
        </div>
        {errors.resume && (
          <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Accepted formats: PDF, DOC, DOCX
        </p>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-300 shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [applicationStats, setApplicationStats] = useState({});

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

  useEffect(() => {
    // Filter jobs based on search term
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(lowercasedSearch) ||
        job.description.toLowerCase().includes(lowercasedSearch) ||
        job.eligibility.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  // Update the fetchJobs function to handle API response correctly
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      const jobsData = response.data;
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      setError(null);

      // Only fetch application statistics if user is HR
      const authToken = localStorage.getItem('authToken');
      const decodedToken = authToken ? jwtDecode(authToken) : null;
      const userRole = decodedToken?.role;
      
      if (userRole === 'hr' && jobsData.length > 0) {
        // Create object to store application stats for each job
        const stats = {};
        
        // Fetch stats for each job individually
        for (const job of jobsData) {
          try {
            // Make sure to use the correct API endpoint
            const statsResponse = await api.get(`/interview/job/${job._id}`);
            
            const interviewData = statsResponse.data;
            
            // Debug the response to see what we're getting
            console.log(`Job ${job._id} stats:`, interviewData);
            
            // Count interviews by status
            let scheduled = 0;
            let completed = 0;
            let total = 0;
            
            if (interviewData && Array.isArray(interviewData)) {
              total = interviewData.length;
              
              interviewData.forEach(interview => {
                if (interview.status === 'scheduled') {
                  scheduled++;
                } else if (interview.status === 'completed') {
                  completed++;
                }
              });
            }
            
            // Store statistics for this job
            stats[job._id] = {
              total,
              scheduled,
              completed
            };
            
            console.log(`Stats for job ${job._id}:`, stats[job._id]);
          } catch (err) {
            console.error(`Failed to fetch stats for job ${job._id}:`, err.response || err);
            // Initialize with zeros if we fail to get the data
            stats[job._id] = { total: 0, scheduled: 0, completed: 0 };
          }
        }
        
        setApplicationStats(stats);
      }
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
      setFilteredJobs([...filteredJobs, response.data]);
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
      formData.append('file', applicationData.resume);
      formData.append('jobId', jobId);
      formData.append('phone', applicationData.phone);
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const decoded = jwtDecode(authToken);
          formData.append('userId', decoded.id);
        } catch (err) {
          console.error("Failed to decode token:", err);
          alert("Failed to retrieve user information. Please try again.");
          return;
        }
      }

      await api.post(
        '/job/upload', 
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

  const openJobDetailsModal = (job) => {
    setSelectedJob(job);
    setShowJobDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">JobConnect</h1>
          </div>
          
          {userRole && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {userRole === 'hr' ? 'HR Manager' : 'Job Seeker'}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Explore Opportunities</h2>
              <p className="text-gray-600 mt-1">Find your dream job today</p>
            </div>
            
            {userRole === 'hr' && (
              <button 
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Post New Job
              </button>
            )}
          </div>
          
          <div className="mt-8 relative">
            <div className="flex items-center w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="pl-4">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for jobs by title, description, or requirements..."
                className="w-full py-4 px-3 border-none focus:ring-0 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-gray-100 py-4 px-5 border-l hover:bg-gray-200 transition-colors duration-300">
                <FilterIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl" role="alert">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <BriefcaseIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-800">No job openings available</h3>
            {searchTerm ? (
              <p className="mt-2 text-gray-500 text-center max-w-md">
                No jobs matching "{searchTerm}". Try different keywords or clear your search.
              </p>
            ) : userRole === 'hr' ? (
              <p className="mt-2 text-gray-500">Click "Post New Job" to create your first job posting.</p>
            ) : (
              <p className="mt-2 text-gray-500">Check back later for new opportunities.</p>
            )}
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {searchTerm && (
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center">
                <p className="text-gray-600">
                  Found <span className="font-medium text-gray-900">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'} matching "<span className="font-medium text-gray-900">{searchTerm}</span>"
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            )}
            <JobList 
              jobs={filteredJobs} 
              userRole={userRole} 
              onApply={openApplyForm} 
              applicationStats={applicationStats}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2025 JobConnect. All rights reserved.
          </div>
        </div>
      </footer>

      {showJobForm && (
        <Backdrop>
          <Modal>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Job</h2>
              <button 
                onClick={() => setShowJobForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <JobForm onSubmit={handleCreateJob} onCancel={() => setShowJobForm(false)} />
          </Modal>
        </Backdrop>
      )}

      {showApplyForm && selectedJob && (
        <Backdrop>
          <Modal>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Apply for Position</h2>
                <p className="text-blue-600 font-medium mt-1">{selectedJob.title}</p>
              </div>
              <button 
                onClick={() => {
                  setShowApplyForm(false);
                  setSelectedJob(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
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
          </Modal>
        </Backdrop>
      )}

      {/* Add the Job Details Modal */}
      {showJobDetailsModal && selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => {
            setShowJobDetailsModal(false);
            setSelectedJob(null);
          }}
          onApply={() => {
            setShowJobDetailsModal(false);
            openApplyForm(selectedJob);
          }}
        />
      )}
    </div>
  );
};

// JobDetailsModal Component for displaying full job details
const JobDetailsModal = ({ job, onClose }) => {
  // Format description text by preserving newlines
  const formatDescription = (text) => {
    if (!text) return '';
    
    // Split by newline characters and return as JSX with line breaks
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Backdrop>
      <Modal>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
            <p className="text-gray-500 text-sm mt-1">Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] pr-2">
          {/* Job Details Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Eligibility</h3>
              <p className="text-gray-600">{job.eligibility}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <div className="text-gray-600 prose max-w-none">
                {formatDescription(job.description)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg mr-3 hover:bg-gray-200 transition-colors duration-300"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              // You can add an Apply function here
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Apply Now
          </button>
        </div>
      </Modal>
    </Backdrop>
  );
};

export default JobListPage;