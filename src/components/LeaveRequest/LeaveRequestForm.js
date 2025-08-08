import React, { useState, useEffect } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import styles from './LeaveRequestForm.module.css';
import { leaveRequestAPI } from '../../services/api';
import { 
  LEAVE_TYPES, 
  LEAVE_REASONS, 
  PARTIAL_DAY_OPTIONS, 
  DATE_FORMAT,
  VALIDATION_MESSAGES 
} from '../../utils/constants';

const LeaveRequestForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    requestType: '',
    reason: '',
    detailReason: '',
    startDate: '',
    endDate: '',
    partialDay: 'FULL_DAY',
    approverId: '',
    supervisorId: '',
    informTo: '',
    expectedApprove: ''
  });

  const [users, setUsers] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(10);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Load users for approver/supervisor selection
        const usersResponse = await leaveRequestAPI.getUsers();
        setUsers(usersResponse.data || []);
        
        // Load leave balance for current user (assuming user ID 1 for demo)
        const balanceResponse = await leaveRequestAPI.getLeaveBalance(1);
        setLeaveBalance(balanceResponse.data?.remainingDays || 0);
        
      } catch (error) {
        console.error('Error loading data:', error);
        // Set mock data if API fails
        setUsers([
          { id: 1, name: 'John Manager', email: 'john@company.com', role: 'Manager' },
          { id: 2, name: 'Sarah Supervisor', email: 'sarah@company.com', role: 'Supervisor' },
          { id: 3, name: 'Mike Director', email: 'mike@company.com', role: 'Director' }
        ]);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Calculate total days
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    try {
      const start = parseISO(formData.startDate);
      const end = parseISO(formData.endDate);
      return Math.max(0, differenceInDays(end, start) + 1);
    } catch (error) {
      return 0;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.requestType) {
      newErrors.requestType = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.reason) {
      newErrors.reason = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.startDate) {
      newErrors.startDate = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.endDate) {
      newErrors.endDate = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.approverId) {
      newErrors.approverId = VALIDATION_MESSAGES.REQUIRED;
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = VALIDATION_MESSAGES.END_BEFORE_START;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        totalDays: calculateDays(),
        status: 'PENDING',
        requestDate: format(new Date(), DATE_FORMAT)
      };

      await leaveRequestAPI.createLeaveRequest(requestData);
      
      if (onSubmit) {
        onSubmit(requestData);
      }
      
      alert('Leave request submitted successfully!');
      
      // Reset form
      setFormData({
        requestType: '',
        reason: '',
        detailReason: '',
        startDate: '',
        endDate: '',
        partialDay: 'FULL_DAY',
        approverId: '',
        supervisorId: '',
        informTo: '',
        expectedApprove: ''
      });
      
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Create New Request</h1>
        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          {/* Left Section - Request Details */}
          <div className={styles.leftSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>📋</div>
              <h2 className={styles.sectionTitle}>Request Details</h2>
              <div className={styles.leaveBalance}>
                <div className={styles.balanceNumber}>{leaveBalance}</div>
                <span className={styles.balanceText}>Remaining Leave</span>
                <a href="#" className={styles.balanceLink}>Leave Balance</a>
              </div>
            </div>

            {/* Request Type and Reason */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Request Type <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={formData.requestType}
                  onChange={(e) => handleInputChange('requestType', e.target.value)}
                >
                  <option value="">Select type</option>
                  {LEAVE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.requestType && <div className={styles.error}>{errors.requestType}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Reason <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                >
                  <option value="">Choose Reason</option>
                  {LEAVE_REASONS.map(reason => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                {errors.reason && <div className={styles.error}>{errors.reason}</div>}
              </div>
            </div>

            {/* Duration Section */}
            <div className={styles.durationSection}>
              <div className={styles.durationHeader}>
                <h3 className={styles.durationTitle}>Duration</h3>
                <span className={styles.durationTotal}>
                  Total: {calculateDays()} day(s)
                </span>
                <button type="button" className={styles.addDayBtn}>
                  ➕ Add Day
                </button>
              </div>

              <div className={styles.dayRow}>
                <span className={styles.dayLabel}>0 day(s)</span>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Date <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                  {errors.startDate && <div className={styles.error}>{errors.startDate}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>End Date <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                  {errors.endDate && <div className={styles.error}>{errors.endDate}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Partial Day <span className={styles.required}>*</span></label>
                  <select
                    className={styles.partialSelect}
                    value={formData.partialDay}
                    onChange={(e) => handleInputChange('partialDay', e.target.value)}
                  >
                    {PARTIAL_DAY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Detail Reason */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Detail Reason</label>
              <textarea
                className={styles.textarea}
                placeholder="Enter detail reason ..."
                value={formData.detailReason}
                onChange={(e) => handleInputChange('detailReason', e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Right Section - Approval Status */}
          <div className={styles.rightSection}>
            <div className={styles.approvalSection}>
              <h3>Approval Status</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Approver <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={formData.approverId}
                  onChange={(e) => handleInputChange('approverId', e.target.value)}
                >
                  <option value="">Select approver</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.role}
                    </option>
                  ))}
                </select>
                {errors.approverId && <div className={styles.error}>{errors.approverId}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Supervisor <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={formData.supervisorId}
                  onChange={(e) => handleInputChange('supervisorId', e.target.value)}
                >
                  <option value="">Select supervisor</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Inform To</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Type 3 chars to find account..."
                  value={formData.informTo}
                  onChange={(e) => handleInputChange('informTo', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Expected Approve</label>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.expectedApprove}
                  onChange={(e) => handleInputChange('expectedApprove', e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;