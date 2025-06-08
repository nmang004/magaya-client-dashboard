const bcrypt = require('bcryptjs');

// Mock user database with pre-hashed passwords
const users = [
  {
    id: 1,
    email: 'demo@client1.com',
    password: '$2a$10$zbl65b9/o0l798hiqzPZrOdwBFjWxQ3kZMgIVZgeAQ9YuQTOqBIma', // password: demo123
    companyName: 'ABC Logistics International',
    clientId: 'CLIENT001',
    role: 'client',
    profile: {
      contactPerson: 'John Smith',
      phone: '+1 (555) 123-4567',
      address: '123 Shipping Lane, Port City, PC 12345',
      logo: 'https://via.placeholder.com/150',
      timezone: 'America/New_York',
      preferredCurrency: 'USD'
    },
    permissions: ['view_shipments', 'view_transactions', 'view_analytics', 'download_documents'],
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  },
  {
    id: 2,
    email: 'demo@client2.com',
    password: '$2a$10$zbl65b9/o0l798hiqzPZrOdwBFjWxQ3kZMgIVZgeAQ9YuQTOqBIma', // password: demo123
    companyName: 'XYZ Global Shipping Co.',
    clientId: 'CLIENT002',
    role: 'client',
    profile: {
      contactPerson: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      address: '456 Freight Blvd, Harbor Town, HT 67890',
      logo: 'https://via.placeholder.com/150',
      timezone: 'America/Los_Angeles',
      preferredCurrency: 'USD'
    },
    permissions: ['view_shipments', 'view_transactions', 'view_analytics', 'download_documents', 'create_bookings'],
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date()
  },
  {
    id: 3,
    email: 'admin@wmstone.com',
    password: '$2a$10$zbl65b9/o0l798hiqzPZrOdwBFjWxQ3kZMgIVZgeAQ9YuQTOqBIma', // password: demo123
    companyName: 'W.M. Stone Logistics, LLC',
    clientId: 'ADMIN001',
    role: 'admin',
    profile: {
      contactPerson: 'Admin User',
      phone: '+1 (757) 800-6080',
      address: '555 E. Main St, Suite 803, Norfolk, VA 23510',
      logo: 'https://via.placeholder.com/150',
      timezone: 'America/New_York',
      preferredCurrency: 'USD'
    },
    permissions: ['*'], // All permissions
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  }
];

// Helper function to verify password
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Helper function to hash password (for creating new users)
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

module.exports = {
  users,
  verifyPassword,
  hashPassword
};