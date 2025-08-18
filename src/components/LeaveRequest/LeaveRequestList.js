import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Import thêm function getAllLeaveRequests nếu cần
import { leaveRequestAPI } from "../../services/api";
import styles from "./LeaveRequestList.module.css";

const LeaveRequestList = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState("01/01/2025-31/12/2025");
  const [requestTypeFilter, setRequestTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const itemsPerPage = 10;

  const [leaveBalance, setLeaveBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError("");
    try {
      // Sử dụng leaveRequestAPI.getAllLeaveRequests từ api.js
      const response = await leaveRequestAPI.getAllLeaveRequests();
      
      // API trả về trực tiếp array, không có wrapper .data
      console.log("📄 Fetched leave requests:", response);
      
      if (Array.isArray(response)) {
        setLeaveRequests(response);
        setFilteredRequests(response);
      } else {
        console.warn("⚠️ API response is not an array:", response);
        setLeaveRequests([]);
        setFilteredRequests([]);
      }
      
      // Tính toán leave balance từ dữ liệu có sẵn hoặc gọi API riêng
      // Tạm thời set default, bạn có thể thêm API endpoint riêng cho balance
      setLeaveBalance(10);
      
    } catch (error) {
      console.error("❌ Error fetching leave requests:", error);
      setError("Failed to load leave requests. Please try again.");
      setLeaveRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    let filtered = leaveRequests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((req) =>
        `${req.type} ${req.reason} ${req.approver}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by request type
    if (requestTypeFilter) {
      filtered = filtered.filter((req) => req.type === requestTypeFilter);
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, requestTypeFilter, statusFilter, leaveRequests]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRequestTypeFilter("");
    setStatusFilter("");
    setDateRange("01/01/2025-31/12/2025");
  };

  const getStatusClassName = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return styles.approved;
      case "confirmed":
        return styles.confirmed;
      case "rejected":
        return styles.rejected;
      case "pending":
        return styles.pending;
      default:
        return styles.pending;
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.navLeft}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbIcon}>📋</span>
            <span>My Request</span>
          </div>
        </div>
        <div className={styles.navRight}>
          <button className={styles.createButton} onClick={() => navigate("/leave-requests/create")}>
            + Create Leave Request
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Leave Balance */}
      <div className={styles.leaveBalance}>
        <span className={styles.balanceNumber}>{leaveBalance}</span>
        <span className={styles.balanceText}>Remaining Leave</span>
        <button className={styles.balanceLink}>Leave Balance</button>
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>From - To</label>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Request Type</label>
          <select
            value={requestTypeFilter}
            onChange={(e) => setRequestTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Select options</option>
            <option value="Work from home">Work from home</option>
            <option value="Paid leave">Paid leave</option>
            <option value="Summer Vacation leave">Summer Vacation leave</option>
            <option value="Maternity leave">Maternity leave</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Request Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Select options</option>
            <option value="Approved">Approved</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className={styles.filterActions}>
          <button className={styles.clearBtn} onClick={clearFilters}>
            Clear
          </button>
          <button className={styles.searchBtn} onClick={fetchLeaveRequests} disabled={loading}>
            {loading ? "🔄" : "🔍"} {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Request Type</th>
                <th>Time Request</th>
                <th>Partial Day</th>
                <th>Recurrence</th>
                <th>Duration (Days)</th>
                <th>Reason</th>
                <th>Approver</th>
                <th>Delegate To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    Loading leave requests...
                  </td>
                </tr>
              ) : currentRequests.length > 0 ? (
                currentRequests.map((req, index) => (
                  <tr key={req.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      <span className={styles.requestType}>{req.requestType}</span>
                    </td>
                    <td>{req.timeRequest}{req.startDate} - {req.endDate}</td>
                    <td>{req.partialDay || "All Day"}</td>
                    <td>{req.recurrence || "--"}</td>
                    <td className={styles.duration}>{req.totalDays}</td>
                    <td className={styles.reason}>{req.reason}</td>
                    <td>{req.approver}</td>
                    <td>{req.delegateTo || "--"}</td>
                    <td>
                      <span className={getStatusClassName(req.status)}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className={styles.noData}>
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={styles.paginationBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={styles.paginationBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;