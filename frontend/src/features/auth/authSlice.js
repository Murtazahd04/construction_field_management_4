// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiyb from '../../api/axios';
import { toast } from 'react-hot-toast';

// Async Action: Login
export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    // Backend expects: { email, password }
    const response = await apiyb.post('/auth/login', userData); //
    
    // Save token to LocalStorage immediately
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const loginAdmin = createAsyncThunk('auth/adminLogin', async (creds, thunkAPI) => {
  try {
    const response = await apiyb.post('/auth/admin-login', creds);
    
    // Save Admin Token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    toast.success("Welcome, Super Admin!");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Admin Login Failed';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const submitEnquiry = createAsyncThunk('auth/enquiry', async (data, thunkAPI) => {
  try {
    const response = await apiyb.post('/enquiry/submit', data);
    toast.success("Enquiry Sent! Our team will contact you.");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send enquiry';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;