import axios from 'axios';
import { setGlobalLogout } from './fetchWithAuth';

// Global logout function that will be set by AuthContext
let globalLogout: (() => void) | null = null;

export const setGlobalAxiosLogout = (logoutFn: () => void) => {
  globalLogout = logoutFn;
};

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('idToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      sessionStorage.removeItem('idToken');
      sessionStorage.removeItem('user');
      
      // Use the global logout function if available, otherwise fallback to window.location
      if (globalLogout) {
        globalLogout();
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

