import React, { useState } from 'react';
import LeaveRequestForm from './components/LeaveRequest/LeaveRequestForm';
import LeaveRequestList from './components/LeaveRequest/LeaveRequestList';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(true);
  const [submittedRequests, setSubmittedRequests] = useState([]);

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = (requestData) => {
    setSubmittedRequests(prev => [...prev, requestData]);
    setShowForm(false); // sau khi submit thì quay về danh sách
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

          <LeaveRequestList 
            requests={submittedRequests} 
            onCreateNew={showCreateForm} 
          />
        </div>
      )}
    </div>
  );
}

export default App;