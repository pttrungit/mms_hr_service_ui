import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [balanceDetails, setBalanceDetails] = useState([]); // chi tiết entitlement days
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await leaveRequestAPI.getAllLeaveRequests();
      if (Array.isArray(response)) {
        setLeaveRequests(response);
        setFilteredRequests(response);
      } else {
        setLeaveRequests([]);
        setFilteredRequests([]);
      }

      // Giả sử API trả về entitlement days
      setLeaveBalance(10);
      setBalanceDetails([
        { name: "Paid leave", unit: "Day", max: 12, approved: 2, remaining: 10, pending: 0 },
        { name: "Compensation leave", unit: "Day", max: 9, approved: 0, remaining: 9, pending: 0 },
        { name: "Sick leave", unit: "Day", max: 30, approved: 0, remaining: 30, pending: 0 },
      ]);
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
          <button
            className={styles.createButton}
            onClick={() => navigate("/leave-requests/create")}
          >
            + Create Leave Request
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Leave Balance */}
      <div className={styles.leaveBalance}>
        <span className={styles.balanceNumber}>{leaveBalance}</span>
        <span className={styles.balanceText}>Remaining Leave</span>
        <button
          className={styles.balanceLink}
          onClick={() => setShowBalanceModal(true)}
        >
          Leave Balance
        </button>
      </div>

      {/* TABLE REQUESTS */}
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
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, idx) => (
                  <tr key={req.id}>
                    <td>{idx + 1}</td>
                    <td>{req.type}</td>
                    <td>{req.startDate} - {req.endDate}</td>
                    <td>{req.partialDay || "All Day"}</td>
                    <td>{req.recurrence || "--"}</td>
                    <td>{req.totalDays}</td>
                    <td>{req.reason}</td>
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

      {/* MODAL Leave Balance */}
      {showBalanceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Entitle Days</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowBalanceModal(false)}
              >
                ✖
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Request Name</th>
                  <th>Unit</th>
                  <th>Maximum Allowed</th>
                  <th>Approved Quotas</th>
                  <th>Remaining Quotas</th>
                  <th>Pending Quotas</th>
                </tr>
              </thead>
              <tbody>
                {balanceDetails.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>{item.max}</td>
                    <td>{item.approved}</td>
                    <td>{item.remaining}</td>
                    <td>{item.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;
