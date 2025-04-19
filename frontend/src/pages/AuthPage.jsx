import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
    role: 'candidate',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    if (apiError) {
      setApiError('');
    }
  };

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Email is invalid';
    
    if (!formData.password) tempErrors.password = 'Password is required';
    else if (formData.password.length < 4) tempErrors.password = 'Password must be at least 4 characters';
    
    if (!isLogin) {
      if (!formData.name) tempErrors.name = 'Name is required';
      
      if (!formData.confirmPassword) tempErrors.confirmPassword = 'Please confirm your password';
      else if (formData.confirmPassword !== formData.password) tempErrors.confirmPassword = 'Passwords do not match';
      
      if (!formData.username) tempErrors.username = 'Username is required';
      else if (formData.username.length < 3) tempErrors.username = 'Username must be at least 3 characters';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true);
      setApiError('');
      setSuccessMessage('');

      try {
        let response;
        
        if (isLogin) {
          response = await api.post('/auth/login', {
            email: formData.email,
            password: formData.password
          });

          const { token, user } = response.data;
          localStorage.setItem('authToken', token);
          dispatch(login({ user, token }));
          navigate('/dashboard');
        } else {
          response = await api.post('/auth/register', {
            fullname: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          });

          setSuccessMessage(
            'Registration successful! Please log in with the same credentials.'
          );

          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            username: '',
            role: 'candidate',
          });

          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage('');
          }, 10000);
        }
      } catch (error) {
        console.error('Authentication error:', error);

        if (error.response) {
          setApiError(
            error.response.data.message || 'Authentication failed. Please try again.'
          );
        } else if (error.request) {
          setApiError('No response from server. Please check your internet connection.');
        } else {
          setApiError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setApiError('');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-transparent"></div>
        <div className="z-10 max-w-xl px-12 text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to NextGen-HR</h1>
          <p className="text-xl mb-8">Your gateway to unlimited career opportunities. Join thousands of professionals finding their dream jobs every day.</p>
          <div className="flex space-x-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center">
              <span className="text-4xl font-bold">5K+</span>
              <span className="text-sm">Active Jobs</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center">
              <span className="text-4xl font-bold">3M+</span>
              <span className="text-sm">Users</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center">
              <span className="text-4xl font-bold">98%</span>
              <span className="text-sm">Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-indigo-100">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="font-medium text-indigo-200 hover:text-white focus:outline-none transition-colors duration-300"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
          
          {successMessage && (
            <div className="mb-6 rounded-lg bg-green-100 border border-green-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {apiError && (
            <div className="mb-6 rounded-lg bg-red-100 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{apiError}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-white/10 border ${
                      errors.name ? 'border-red-400' : 'border-transparent'
                    } backdrop-blur-sm text-white rounded-lg px-4 py-2.5 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200`}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white mb-1">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full bg-white/10 border ${
                      errors.username ? 'border-red-400' : 'border-transparent'
                    } backdrop-blur-sm text-white rounded-lg px-4 py-2.5 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200`}
                    placeholder="johndoe"
                    disabled={loading}
                  />
                  {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.email ? 'border-red-400' : 'border-transparent'
                } backdrop-blur-sm text-white rounded-lg px-4 py-2.5 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200`}
                placeholder="email@example.com"
                disabled={loading}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.password ? 'border-red-400' : 'border-transparent'
                } backdrop-blur-sm text-white rounded-lg px-4 py-2.5 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-white/10 border ${
                    errors.confirmPassword ? 'border-red-400' : 'border-transparent'
                  } backdrop-blur-sm text-white rounded-lg px-4 py-2.5 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {!isLogin && (
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Candidate Account
                </span>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-indigo-100">
                    Remember me
                  </label>
                </div>

                <div>
                  <a href="#" className="font-medium text-indigo-200 hover:text-white transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-indigo-300/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-indigo-800/20 backdrop-blur-sm text-indigo-100 rounded">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="http://localhost:8000/auth/google"
                className="w-full flex justify-center items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Google
              </a>

              <a
                href="http://localhost:8000/auth/github"
                className="w-full flex justify-center items-center px-4 py-2 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12,2C6.477,2,2,6.477,2,12c0,4.419,2.865,8.166,6.839,9.489c0.5,0.09,0.682-0.218,0.682-0.484 c0-0.236-0.009-0.866-0.014-1.699c-2.782,0.602-3.369-1.34-3.369-1.34c-0.455-1.157-1.11-1.465-1.11-1.465 c-0.909-0.62,0.069-0.608,0.069-0.608c1.004,0.071,1.532,1.03,1.532,1.03c0.891,1.529,2.341,1.089,2.91,0.833 c0.091-0.647,0.349-1.086,0.635-1.337c-2.22-0.251-4.555-1.111-4.555-4.943c0-1.091,0.39-1.984,1.03-2.682 c-0.103-0.253-0.446-1.272,0.098-2.65c0,0,0.84-0.269,2.75,1.022C8.85,6.344,9.425,6.25,10,6.25s1.15,0.094,1.7,0.277 c1.909-1.291,2.747-1.022,2.747-1.022c0.546,1.378,0.202,2.396,0.1,2.65c0.64,0.699,1.026,1.591,1.026,2.682 c0,3.841-2.337,4.687-4.565,4.935c0.359,0.307,0.679,0.917,0.679,1.852c0,1.335-0.012,2.415-0.012,2.741 c0,0.269,0.18,0.579,0.688,0.481C19.138,20.161,22,16.416,22,12C22,6.477,17.523,2,12,2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-indigo-200">
              By {isLogin ? 'signing in' : 'creating an account'}, you agree to our 
              <a href="#" className="font-medium text-indigo-300 hover:text-white ml-1">Terms of Service</a> and 
              <a href="#" className="font-medium text-indigo-300 hover:text-white ml-1">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;