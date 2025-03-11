import api from '../utils/api';

/**
 * Authentication service for handling user authentication operations
 */
const authService = {
  /**
   * Login a user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise} - Promise resolving to user data and token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise resolving to user data and token
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get the current authenticated user
   * @returns {Promise} - Promise resolving to user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise resolving to updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Old and new password
   * @returns {Promise} - Promise resolving to success message
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request a password reset
   * @param {String} email - User email
   * @returns {Promise} - Promise resolving to success message
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {String} token - Reset token
   * @param {String} password - New password
   * @returns {Promise} - Promise resolving to success message
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout: () => {
    // This is handled in the AuthContext by removing the token
    // You could add a server-side logout here if needed
    return Promise.resolve();
  }
};

export default authService;