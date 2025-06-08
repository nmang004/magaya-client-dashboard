// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Date validation
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Tracking number validation
const isValidTrackingNumber = (trackingNumber) => {
  // Format: MAG followed by numbers
  const trackingRegex = /^MAG\d+$/;
  return trackingRegex.test(trackingNumber);
};

// Pagination validation
const validatePagination = (page, limit) => {
  const validPage = parseInt(page) || 1;
  const validLimit = parseInt(limit) || 20;
  
  return {
    page: Math.max(1, validPage),
    limit: Math.min(100, Math.max(1, validLimit))
  };
};

// Shipment status validation
const isValidShipmentStatus = (status) => {
  const validStatuses = [
    'Pending',
    'Processing',
    'In Transit',
    'Customs Hold',
    'Out for Delivery',
    'Delivered',
    'Delayed',
    'Returned'
  ];
  
  return validStatuses.includes(status);
};

// Transaction status validation
const isValidTransactionStatus = (status) => {
  const validStatuses = ['paid', 'pending', 'overdue', 'cancelled'];
  return validStatuses.includes(status);
};

module.exports = {
  isValidEmail,
  isValidDate,
  isValidTrackingNumber,
  validatePagination,
  isValidShipmentStatus,
  isValidTransactionStatus
};