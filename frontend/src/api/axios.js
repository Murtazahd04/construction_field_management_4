// src/api/axios.js
import axios from 'axios';

const apiyb = axios.create({
  baseURL: 'http://localhost:3000/api', // Your Express Server URL
});

// Automatically add Token to every request if logged in
apiyb.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiyb;