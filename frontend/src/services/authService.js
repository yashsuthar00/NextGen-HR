// frontend/src/services/authService.js
import api from '../utils/api';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
