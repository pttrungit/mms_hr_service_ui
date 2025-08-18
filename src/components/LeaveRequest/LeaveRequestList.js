import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- hook navigate
import { leaveRequestAPI } from "../../services/api";
import styles from "./LeaveRequestList.module.css";

const LeaveRequestList = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchLeaveRequests = async () => {
    try {
      const userId = localStorage.getItem("userId") || 1;
      const response = await leaveRequestAPI.getLeaveRequests(userId);
      setLeaveRequests(response.data);
      setFilteredRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    const filtered = leaveRequests.filter((req) =>
      `${req.type} ${req.reason} ${req.approver}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, leaveRequests]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // --- Handle logout ---
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/"); // quay về login
  };

  return (
    <div className={styles.container}>
      {/* Header với logout */}
      <div className={styles.header}>
        <h2 className={styles.title}>Leave Request List</h2>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Button tạo request */}
      <div className={styles.createButtonWrapper}>
        <button
          className={styles.createButton}
          onClick={() => navigate("/leave-requests/create")}
        >
          Create Leave Request
        </button>
      </div>

      {/* Search bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by Type, Reason, Approver..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Request Type</th>
              <th>Time Request</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Approver</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((req, index) => (
                <tr key={req.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{req.type}</td>
                  <td>{req.timeRequest}</td>
                  <td>{req.duration}</td>
                  <td>{req.reason}</td>
                  <td>{req.approver}</td>
                  <td
                    className={
                      req.status === "Approved"
                        ? styles.approved
                        : req.status === "Rejected"
                        ? styles.rejected
                        : styles.pending
                    }
                  >
                    {req.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;
