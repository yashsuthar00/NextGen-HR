import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import authService from '../services/authService';

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Load user on initial render
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;