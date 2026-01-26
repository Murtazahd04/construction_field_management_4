// frontend/src/features/materials/materialSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiyb from '../../api/axios';
import { toast } from 'react-hot-toast';

// 1. Fetch Materials (Inventory)
export const fetchMaterials = createAsyncThunk('materials/fetchList', async () => {
    const response = await apiyb.get('/materials/list');
    return response.data;
});

// 2. Fetch Requests (Approval Hub)
export const fetchRequests = createAsyncThunk('materials/fetchRequests', async () => {
    const response = await apiyb.get('/materials/requests');
    return response.data;
});

// 3. Approve Request
export const approveRequest = createAsyncThunk('materials/approve', async ({ id, remarks }, { dispatch }) => {
    const response = await apiyb.put(`/materials/requests/${id}/approve`, { remarks });
    toast.success("Request Approved Successfully");
    dispatch(fetchRequests()); // Refresh list
    return response.data;
});

const materialSlice = createSlice({
    name: 'materials',
    initialState: {
        materialsList: [],
        requestsList: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Materials List
            .addCase(fetchMaterials.pending, (state) => { state.loading = true; })
            .addCase(fetchMaterials.fulfilled, (state, action) => {
                state.loading = false;
                state.materialsList = action.payload;
            })
            // Requests List
            .addCase(fetchRequests.pending, (state) => { state.loading = true; })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requestsList = action.payload;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default materialSlice.reducer;