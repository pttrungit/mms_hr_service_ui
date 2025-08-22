import React from "react";
import "./LeaveBalanceModal.css";

const LeaveBalanceModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Entitle Days</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <table className="entitle-table">
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
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.name}</td>
                <td>{row.unit}</td>
                <td>{row.max}</td>
                <td>{row.approved}</td>
                <td>{row.remaining}</td>
                <td>{row.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveBalanceModal;
