import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
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
      state.token = action.payload.token;
      // Save state to local storage
      localStorage.setItem('authState', JSON.stringify({ isAuthenticated: true, token: action.payload.token }));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      // Remove state from local storage
      localStorage.removeItem('authState');
      localStorage.removeItem('authToken'); // Ensure authToken is also cleared
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
