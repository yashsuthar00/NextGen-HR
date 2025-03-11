import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interview related API calls
const interviewApi = {
  // Get interview questions for a candidate
  getInterviewQuestions: async (interviewId) => {
    try {
      const response = await api.get(`/interviews/${interviewId}/questions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch interview questions' };
    }
  },

  // Initialize an interview session
  initializeInterview: async (candidateId, interviewTypeId) => {
    try {
      const response = await api.post('/interviews/initialize', {
        candidateId,
        interviewTypeId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to initialize interview' };
    }
  },

  // Complete an interview
  completeInterview: async (interviewId) => {
    try {
      const response = await api.post(`/interviews/${interviewId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to complete interview' };
    }
  }
};

// Video upload related API calls
const videoApi = {
  // Upload a video response
  uploadVideoResponse: async (videoFile, metadata, onUploadProgress) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('metadata', JSON.stringify(metadata));
    
    try {
      const response = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onUploadProgress) {
            onUploadProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload video' };
    }
  },

  // Get processed video analysis
  getVideoAnalysis: async (responseId) => {
    try {
      const response = await api.get(`/videos/analysis/${responseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get video analysis' };
    }
  }
};

export { interviewApi, videoApi };