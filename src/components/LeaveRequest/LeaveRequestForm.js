import React, { useState, useEffect } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import styles from './LeaveRequestForm.module.css'; // import CSS module
import { leaveRequestAPI } from '../../services/api';
import { 
  LEAVE_TYPES, 
  LEAVE_REASONS, 
  PARTIAL_DAY_OPTIONS, 
  DATE_FORMAT,
  VALIDATION_MESSAGES 
} from '../../utils/constants';

const LeaveRequestForm = () => {
  const navigate = useNavigate(); // hook navigate
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
        
        const usersResponse = await leaveRequestAPI.getUsers();
        setUsers(usersResponse.data || []);
        
        const balanceResponse = await leaveRequestAPI.getLeaveBalance(1);
        setLeaveBalance(balanceResponse.data?.remainingDays || 0);
      } catch (error) {
        console.error('Error loading data:', error);
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
    if (!formData.requestType) newErrors.requestType = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.reason) newErrors.reason = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.startDate) newErrors.startDate = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.endDate) newErrors.endDate = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.approverId) newErrors.approverId = VALIDATION_MESSAGES.REQUIRED;

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) newErrors.endDate = VALIDATION_MESSAGES.END_BEFORE_START;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        totalDays: calculateDays(),
        status: 'PENDING',
        requestDate: format(new Date(), DATE_FORMAT)
      };

      await leaveRequestAPI.createLeaveRequest(requestData);
      alert('Leave request submitted successfully!');

      // reset form
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

      // sau khi submit xong → quay về LeaveRequestList
      navigate('/leave-requests');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // khi nhấn close → quay về LeaveRequestList
    navigate('/leave-requests');
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
        <h1 className={styles.headerTitle}>Create New Leave Request</h1>
        <button className={styles.closeBtn} onClick={handleClose}>
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>📋</div>
              <h2 className={styles.sectionTitle}>Request Details</h2>
              <div className={styles.leaveBalance}>
                <div className={styles.balanceNumber}>{leaveBalance}</div>
                <span className={styles.balanceText}>Remaining Leave</span>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Request Type *</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => handleInputChange('requestType', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select type</option>
                  {LEAVE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.requestType && <div className={styles.error}>{errors.requestType}</div>}
              </div>

              <div className={styles.formGroup}>
                <label>Reason *</label>
                <select
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose reason</option>
                  {LEAVE_REASONS.map(reason => (
                    <option key={reason.value} value={reason.value}>{reason.label}</option>
                  ))}
                </select>
                {errors.reason && <div className={styles.error}>{errors.reason}</div>}
              </div>
            </div>

            {/* Duration */}
            <div className={styles.durationSection}>
              <div className={styles.durationHeader}>
                <h3>Total: {calculateDays()} day(s)</h3>
                <div className={styles.formGroup}>
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={styles.dateInput}
                  />
                  {errors.startDate && <div className={styles.error}>{errors.startDate}</div>}
                </div>
                <div className={styles.formGroup}>
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={styles.dateInput}
                  />
                  {errors.endDate && <div className={styles.error}>{errors.endDate}</div>}
                </div>
                <div className={styles.formGroup}>
                  <label>Partial Day *</label>
                  <select
                    value={formData.partialDay}
                    onChange={(e) => handleInputChange('partialDay', e.target.value)}
                    className={styles.partialSelect}
                  >
                    {PARTIAL_DAY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Detail Reason</label>
              <textarea
                value={formData.detailReason}
                onChange={(e) => handleInputChange('detailReason', e.target.value)}
                rows={4}
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className={styles.rightSection}>
            <div className={styles.approvalSection}>
              <h3>Approval Status</h3>
              <div className={styles.formGroup}>
                <label>Approver *</label>
                <select
                  value={formData.approverId}
                  onChange={(e) => handleInputChange('approverId', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select approver</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} - {u.role}</option>
                  ))}
                </select>
                {errors.approverId && <div className={styles.error}>{errors.approverId}</div>}
              </div>

              <div className={styles.formGroup}>
                <label>Supervisor</label>
                <select
                  value={formData.supervisorId}
                  onChange={(e) => handleInputChange('supervisorId', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select supervisor</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} - {u.role}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Inform To</label>
                <input
                  type="text"
                  value={formData.informTo}
                  onChange={(e) => handleInputChange('informTo', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Expected Approve</label>
                <input
                  type="date"
                  value={formData.expectedApprove}
                  onChange={(e) => handleInputChange('expectedApprove', e.target.value)}
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
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
