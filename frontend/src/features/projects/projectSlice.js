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
    return response.data.project;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create project");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// 3. Fetch Single Project Details
export const fetchProjectDetails = createAsyncThunk('projects/fetchDetails', async (id, thunkAPI) => {
    try {
        const response = await apiyb.get(`/projects/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch details');
    }
});

// 4. Fetch Available Contractors List
export const fetchContractors = createAsyncThunk('projects/fetchContractors', async (_, thunkAPI) => {
    try {
        const response = await apiyb.get('/projects/contractors/list');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// 5. Assign Contractor
export const assignContractor = createAsyncThunk('projects/assign', async (data, thunkAPI) => {
    try {
        const response = await apiyb.post('/projects/assign-contractor', data);
        toast.success("Contractor Assigned!");
        thunkAPI.dispatch(fetchProjectDetails(data.project_id));
        return response.data;
    } catch (error) {
        toast.error("Failed to assign contractor");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
});

// 6. Fetch DPRs
export const fetchProjectDPRs = createAsyncThunk('projects/fetchDPRs', async (projectId, thunkAPI) => {
    try {
        const response = await apiyb.get(`/dpr/project/${projectId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// 7. Create DPR (NEW)
export const createDPR = createAsyncThunk('projects/createDPR', async (dprData, thunkAPI) => {
    try {
        const response = await apiyb.post('/dpr/create', dprData);
        toast.success("Daily Report Logged Successfully");
        // Refresh the list immediately so the UI updates
        thunkAPI.dispatch(fetchProjectDPRs(dprData.project_id));
        return response.data;
    } catch (error) {
        toast.error("Failed to submit report");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [], 
    currentProject: null,
    contractorsList: [],
    dprList: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Projects
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload); 
      })

      // Fetch Single Project
      .addCase(fetchProjectDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state) => { state.loading = false; })

      // Fetch Contractors List
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.contractorsList = action.payload;
      })

      // Fetch DPRs
      .addCase(fetchProjectDPRs.fulfilled, (state, action) => {
        state.dprList = action.payload;
      })

      // Create DPR
      .addCase(createDPR.pending, (state) => { state.loading = true; })
      .addCase(createDPR.fulfilled, (state) => { state.loading = false; })
      .addCase(createDPR.rejected, (state) => { state.loading = false; });
  },
});

export default projectSlice.reducer;