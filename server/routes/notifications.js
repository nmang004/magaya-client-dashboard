const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

// Mock notifications storage
let notificationsCache = {};

// Generate sample notifications
const generateNotifications = (clientId) => {
  return [
    {
      id: crypto.randomBytes(8).toString('hex'),
      title: 'Shipment Delivered',
      description: 'Your shipment SHP-001234 has been delivered successfully',
      type: 'success',
      read: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      link: '/shipments/SHP-001234'
    },
    {
      id: crypto.randomBytes(8).toString('hex'),
      title: 'Payment Received',
      description: 'Payment for invoice INV-5678 has been received',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      link: '/transactions/TRX-5678'
    },
    {
      id: crypto.randomBytes(8).toString('hex'),
      title: 'Customs Hold',
      description: 'Shipment SHP-002345 is currently held at customs',
      type: 'warning',
      read: true,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      link: '/shipments/SHP-002345'
    }
  ];
};

// GET notifications
router.get('/', authenticateToken, (req, res) => {
  try {
    const clientId = req.user.clientId;
    
    if (!notificationsCache[clientId]) {
      notificationsCache[clientId] = generateNotifications(clientId);
    }

    const notifications = notificationsCache[clientId];
    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notifications',
      code: 'FETCH_ERROR'
    });
  }
});

// PUT mark notification as read
router.put('/:id/read', authenticateToken, (req, res) => {
  try {
    const clientId = req.user.clientId;
    const notifications = notificationsCache[clientId] || [];
    
    const notification = notifications.find(n => n.id === req.params.id);
    
    if (!notification) {
      return res.status(404).json({ 
        error: 'Notification not found',
        code: 'NOT_FOUND'
      });
    }

    notification.read = true;

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ 
      error: 'Failed to mark notification as read',
      code: 'UPDATE_ERROR'
    });
  }
});

// PUT mark all notifications as read
router.put('/read-all', authenticateToken, (req, res) => {
  try {
    const clientId = req.user.clientId;
    const notifications = notificationsCache[clientId] || [];
    
    notifications.forEach(n => {
      n.read = true;
    });

    res.json({
      success: true,
      message: 'All notifications marked as read',
      updated: notifications.length
    });

  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ 
      error: 'Failed to mark all as read',
      code: 'UPDATE_ERROR'
    });
  }
});

module.exports = router;