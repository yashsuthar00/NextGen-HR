import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null, // Add role to the initial state
};

// Load state from local storage if available
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log('Error loading state from local storage:', err);
    return initialState;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadStateFromLocalStorage(),
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role; // Set role on login
      // Save state to local storage
      localStorage.setItem('authState', JSON.stringify(state));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null; // Clear role on logout
      // Remove state from local storage
      localStorage.removeItem('authState');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
