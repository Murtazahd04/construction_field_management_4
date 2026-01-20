import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiyb from '../../api/axios';
import { toast } from 'react-hot-toast';

// 1. Fetch All Projects
export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await apiyb.get('/projects/all');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
  }
});

// 2. Create New Project
export const createProject = createAsyncThunk('projects/create', async (projectData, thunkAPI) => {
  try {
    const response = await apiyb.post('/projects/create', projectData);
    toast.success("Project Created Successfully!");
    return response.data; // Expecting the created project object back
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create project");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [], // All projects stored here
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cases
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Cases
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // Add new project to top of list
      });
  },
});

export default projectSlice.reducer;