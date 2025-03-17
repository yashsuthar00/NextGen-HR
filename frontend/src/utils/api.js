// frontend/src/utils/api.js
import axios from 'axios';

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
