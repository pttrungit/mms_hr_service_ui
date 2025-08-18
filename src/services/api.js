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

// === API CALLS ===

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
};

// Kiểm tra login
export const isLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

// Sau khi login thành công => set cờ
export const setLoggedIn = () => {
  localStorage.setItem("isLoggedIn", "true");
};

// Get all leave requests
export const getAllLeaveRequests = async () => {
  try {
    const response = await api.get("/leave-requests");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch leave requests:", error);
    throw error.response?.data || error;
  }
};

export default api;
export const authAPI = { login, logout, isLoggedIn, setLoggedIn };
export const leaveRequestAPI = { getAllLeaveRequests };
