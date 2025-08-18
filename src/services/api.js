import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const leaveRequestAPI = {
  // Get all leave requests (không cần userId nữa)
  getLeaveRequests: () => api.get('/leave-requests'),

  // Create new leave request
  createLeaveRequest: (requestData) => api.post('/leave-requests', requestData),

  // Update leave request status
  updateLeaveRequestStatus: (requestId, status) =>
    api.patch(`/leave-requests/${requestId}/status`, { status }),

  // Get leave types
  getLeaveTypes: () => api.get('/leave-types'),

  // Get leave reasons
  getLeaveReasons: () => api.get('/leave-reasons'),

  // Get users for approver/supervisor selection
  getUsers: () => api.get('/users'),

  // Get user's leave balance
  getLeaveBalance: (userId) => api.get(`/leave-balance/${userId}`),
};

export default api;
