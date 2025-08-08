import React, { useState } from 'react';
import LeaveRequestForm from './components/LeaveRequest/LeaveRequestForm';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(true);
  const [submittedRequests, setSubmittedRequests] = useState([]);

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = (requestData) => {
    setSubmittedRequests(prev => [...prev, requestData]);
  };

  const showCreateForm = () => {
    setShowForm(true);
  };

  return (
    <div className="App">
      {showForm ? (
        <LeaveRequestForm 
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Leave Request Management</h1>
            <button 
              className="create-request-btn"
              onClick={showCreateForm}
            >
              + Create New Request
            </button>
          </div>
          
          <div className="requests-list">
            <h2>Submitted Requests ({submittedRequests.length})</h2>
            {submittedRequests.length === 0 ? (
              <div className="empty-state">
                <p>No leave requests submitted yet.</p>
                <button 
                  className="create-first-btn"
                  onClick={showCreateForm}
                >
                  Create Your First Request
                </button>
              </div>
            ) : (
              <div className="requests-grid">
                {submittedRequests.map((request, index) => (
                  <div key={index} className="request-card">
                    <div className="request-header">
                      <h3>{request.requestType.replace('_', ' ')}</h3>
                      <span className="status pending">Pending</span>
                    </div>
                    <div className="request-details">
                      <p><strong>Reason:</strong> {request.reason}</p>
                      <p><strong>Duration:</strong> {request.startDate} to {request.endDate}</p>
                      <p><strong>Total Days:</strong> {request.totalDays}</p>
                      <p><strong>Submitted:</strong> {request.requestDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;