import axios from "axios";

// === Base URL backend ===
const API_BASE_URL = "http://localhost:8080";

// === Axios instance ===
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// === REQUEST INTERCEPTOR (Optional - for auth token) ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === RESPONSE INTERCEPTOR (Optional - for error handling) ===
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      // Redirect to login if needed
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// === AUTHENTICATION API ===

// Login API (dùng @RequestParam => query params)
export const login = async (username, password) => {
  try {
    const response = await api.get(
      `/api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    );
    return response.data; // true / false
  } catch (error) {
    console.error("❌ Login failed:", error);
    throw new Error("Invalid credentials or server error.");
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
};

// Kiểm tra login
export const isLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

// Sau khi login thành công => set cờ
export const setLoggedIn = (userId = null) => {
  localStorage.setItem("isLoggedIn", "true");
  if (userId) {
    localStorage.setItem("userId", userId);
  }
};

// === LEAVE REQUEST API ===

// Get all leave requests
export const getAllLeaveRequests = async () => {
  try {
    const response = await api.get("/api/leave-requests");
    console.log("📄 API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch leave requests:", error);
    throw error.response?.data || error;
  }
};

// Get leave requests by user
export const getLeaveRequestsByUser = async (userId) => {
  try {
    const response = await api.get(`/leave-requests/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch user leave requests:", error);
    throw error.response?.data || error;
  }
};

// Create new leave request
export const createLeaveRequest = async (leaveRequestData) => {
  try {
    const response = await api.post("/leave-requests", leaveRequestData);
    console.log("✅ Leave request created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create leave request:", error);
    throw error.response?.data || error;
  }
};

// Update leave request
export const updateLeaveRequest = async (id, leaveRequestData) => {
  try {
    const response = await api.put(`/leave-requests/${id}`, leaveRequestData);
    console.log("✅ Leave request updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update leave request:", error);
    throw error.response?.data || error;
  }
};

// Delete leave request
export const deleteLeaveRequest = async (id) => {
  try {
    const response = await api.delete(`/leave-requests/${id}`);
    console.log("✅ Leave request deleted");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to delete leave request:", error);
    throw error.response?.data || error;
  }
};

// Get leave request by ID
export const getLeaveRequestById = async (id) => {
  try {
    const response = await api.get(`/leave-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch leave request:", error);
    throw error.response?.data || error;
  }
};

// === USER API ===

// Get user leave balance
export const getLeaveBalance = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/leave-balance`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch leave balance:", error);
    // Return default if endpoint doesn't exist
    return { remainingDays: 10, totalDays: 20, usedDays: 10 };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch user profile:", error);
    throw error.response?.data || error;
  }
};

// === SEARCH & FILTER API ===

// Get filtered leave requests
export const getFilteredLeaveRequests = async (filters) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.approver) params.append('approver', filters.approver);
    
    const queryString = params.toString();
    const url = queryString ? `/leave-requests/search?${queryString}` : '/leave-requests';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch filtered leave requests:", error);
    throw error.response?.data || error;
  }
};

// === APPROVAL API (for managers) ===

// Approve leave request
export const approveLeaveRequest = async (requestId, approvalData) => {
  try {
    const response = await api.put(`/leave-requests/${requestId}/approve`, approvalData);
    console.log("✅ Leave request approved");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to approve leave request:", error);
    throw error.response?.data || error;
  }
};

// Reject leave request
export const rejectLeaveRequest = async (requestId, rejectionData) => {
  try {
    const response = await api.put(`/leave-requests/${requestId}/reject`, rejectionData);
    console.log("✅ Leave request rejected");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to reject leave request:", error);
    throw error.response?.data || error;
  }
};

// === DASHBOARD API ===

// Get dashboard statistics
export const getDashboardStats = async (userId) => {
  try {
    const response = await api.get(`/dashboard/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch dashboard stats:", error);
    // Return mock data if endpoint doesn't exist
    return {
      totalRequests: 0,
      approvedRequests: 0,
      pendingRequests: 0,
      rejectedRequests: 0
    };
  }
};

// === EXPORT API COLLECTIONS ===

// Auth API collection
export const authAPI = {
  login: async (username, password) => {
    const result = await login(username, password);
    if (result === true) {
      setLoggedIn();
    }
    return result;
  },
  logout,
  isLoggedIn,
  setLoggedIn
};

// Leave Request API collection
export const leaveRequestAPI = {
  // Read operations
  getAll: getAllLeaveRequests,
  getById: getLeaveRequestById,
  getByUser: getLeaveRequestsByUser,
  getFiltered: getFilteredLeaveRequests,
  
  // Write operations
  create: createLeaveRequest,
  update: updateLeaveRequest,
  delete: deleteLeaveRequest,
  
  // Approval operations
  approve: approveLeaveRequest,
  reject: rejectLeaveRequest,
  
  // Legacy support
  getAllLeaveRequests
};

// User API collection
export const userAPI = {
  getProfile: getUserProfile,
  getLeaveBalance: getLeaveBalance
};

// Dashboard API collection
export const dashboardAPI = {
  getStats: getDashboardStats
};

// === DEFAULT EXPORTS ===
export default api;

// === UTILITY FUNCTIONS ===

// Format date for API
export const formatDateForAPI = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

// Parse API date
export const parseAPIDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Error message helper
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};