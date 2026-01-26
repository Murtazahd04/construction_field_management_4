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

// 1. REGISTER COMPANY (Public)
export const registerCompany = createAsyncThunk('auth/registerCompany', async (companyData, thunkAPI) => {
  try {
    const response = await apiyb.post('/auth/register-company', companyData);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. FETCH PENDING COMPANIES (Admin Only)
export const fetchPendingCompanies = createAsyncThunk('auth/fetchPending', async (_, thunkAPI) => {
  try {
    const response = await apiyb.get('/auth/admin/pending-companies');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch requests';
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. APPROVE COMPANY (Admin Only)
export const approveCompany = createAsyncThunk('auth/approveCompany', async (ownerId, thunkAPI) => {
  try {
    const response = await apiyb.post('/auth/admin/approve-company', { owner_id: ownerId });
    toast.success("Company Approved Successfully!");
    return response.data; // Contains { company, generated_credentials }
  } catch (error) {
    const message = error.response?.data?.message || 'Approval failed';
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
    // NEW STATE VARIABLES
    pendingCompanies: [], // List of companies waiting for approval
    approvalResult: null, // Stores the generated password after approval
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.pendingCompanies = [];
      state.approvalResult = null;
    },
    // Action to clear the "Green Box" after admin copies password
    clearApprovalResult: (state) => {
      state.approvalResult = null;
    }
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

      // REGISTER COMPANY
      .addCase(registerCompany.pending, (state) => { state.isLoading = true; })
      .addCase(registerCompany.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // FETCH PENDING
      .addCase(fetchPendingCompanies.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPendingCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingCompanies = action.payload;
      })
      .addCase(fetchPendingCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // APPROVE COMPANY
      .addCase(approveCompany.pending, (state) => { state.isLoading = true; })
      .addCase(approveCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalResult = action.payload; // Store credentials to show Admin
        // Remove the approved company from the pending list immediately
        state.pendingCompanies = state.pendingCompanies.filter(
            c => c.owner_id !== action.meta.arg // ownerId passed to thunk
        ); 
      })
      .addCase(approveCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});


export const { logout,clearApprovalResult } = authSlice.actions;
export default authSlice.reducer;