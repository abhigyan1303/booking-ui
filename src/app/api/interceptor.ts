import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Log the base URL to verify environment variables
console.log('Base URL:', process.env.REACT_APP_API_BASE_URL);
console.log('API Version:', process.env.ver);

// Create an Axios instance
//`${process.env.REACT_APP_API_BASE_URL}/${process.env.ver}/api`,
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/v1/api',
  timeout: 100000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token or other headers here
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors here
    if (error.response && error.response.status === 401) {
      // Redirect to login page or handle unauthorized access
      // window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;