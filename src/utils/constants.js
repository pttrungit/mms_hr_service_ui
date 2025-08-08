// Leave request types
export const LEAVE_TYPES = [
  { value: 'ANNUAL', label: 'Annual Leave' },
  { value: 'SICK', label: 'Sick Leave' },
  { value: 'MATERNITY', label: 'Maternity Leave' },
  { value: 'PATERNITY', label: 'Paternity Leave' },
  { value: 'EMERGENCY', label: 'Emergency Leave' },
  { value: 'UNPAID', label: 'Unpaid Leave' },
];

// Leave reasons
export const LEAVE_REASONS = [
  { value: 'VACATION', label: 'Vacation' },
  { value: 'MEDICAL', label: 'Medical' },
  { value: 'FAMILY', label: 'Family Emergency' },
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'CONFERENCE', label: 'Conference/Training' },
  { value: 'OTHER', label: 'Other' },
];

// Partial day options
export const PARTIAL_DAY_OPTIONS = [
  { value: 'FULL_DAY', label: 'Full Day' },
  { value: 'MORNING', label: 'Morning (AM)' },
  { value: 'AFTERNOON', label: 'Afternoon (PM)' },
  { value: 'CUSTOM', label: 'Custom Hours' },
];

// Request status
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

// Date formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_DATE: 'Please select a valid date',
  END_BEFORE_START: 'End date must be after start date',
  INVALID_EMAIL: 'Please enter a valid email address',
};