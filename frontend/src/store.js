import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import projectReducer from './features/projects/projectSlice';
import materialReducer from './features/materials/materialSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer, // <--- Add this
    materials: materialReducer,
  },
});