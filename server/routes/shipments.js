const express = require('express');
const router = express.Router();
const { authenticateToken, isolateClientData } = require('../middleware/auth');
const { generateShipments, generateShipment, locations } = require('../mock-data/generator');

// Store shipments in memory (in production, this would be a database)
let shipmentsCache = {};

// Helper function to get or generate shipments for a client
const getClientShipments = (clientId) => {
  if (!shipmentsCache[clientId]) {
    shipmentsCache[clientId] = generateShipments(100, clientId);
  }
  return shipmentsCache[clientId];
};

// GET all shipments with advanced filtering and pagination
router.get('/', authenticateToken, isolateClientData, (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      dateFrom = '',
      dateTo = '',
      origin = '',
      destination = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Get shipments for the client
    let shipments = getClientShipments(req.clientId || 'CLIENT001');

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      shipments = shipments.filter(s => 
        s.trackingNumber.toLowerCase().includes(searchLower) ||
        s.id.toLowerCase().includes(searchLower) ||
        s.container.number.toLowerCase().includes(searchLower) ||
        s.consignee.toLowerCase().includes(searchLower) ||
        s.shipper.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      shipments = shipments.filter(s => s.status === status);
    }

    if (origin) {
      shipments = shipments.filter(s => 
        s.origin.port.toLowerCase().includes(origin.toLowerCase()) ||
        s.origin.country.toLowerCase().includes(origin.toLowerCase())
      );
    }

    if (destination) {
      shipments = shipments.filter(s => 
        s.destination.port.toLowerCase().includes(destination.toLowerCase()) ||
        s.destination.country.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      shipments = shipments.filter(s => new Date(s.createdAt) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      shipments = shipments.filter(s => new Date(s.createdAt) <= toDate);
    }

    // Sort shipments
    shipments.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle nested properties
      if (sortBy === 'origin.port') aVal = a.origin.port;
      if (sortBy === 'origin.port') bVal = b.origin.port;
      if (sortBy === 'destination.port') aVal = a.destination.port;
      if (sortBy === 'destination.port') bVal = b.destination.port;
      
      // Convert dates to timestamps for comparison
      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedShipments = shipments.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      total: shipments.length,
      byStatus: shipments.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {}),
      avgTransitTime: calculateAverageTransitTime(shipments),
      totalValue: shipments.reduce((sum, s) => sum + s.cargo.value, 0)
    };

    res.json({
      success: true,
      data: paginatedShipments,
      pagination: {
        total: shipments.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(shipments.length / limit)
      },
      stats,
      filters: {
        statuses: [...new Set(shipments.map(s => s.status))],
        origins: [...new Set(shipments.map(s => s.origin.port))],
        destinations: [...new Set(shipments.map(s => s.destination.port))]
      }
    });

  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch shipments',
      code: 'FETCH_ERROR'
    });
  }
});

// GET single shipment by ID
router.get('/:id', authenticateToken, isolateClientData, (req, res) => {
  try {
    const shipments = getClientShipments(req.clientId || 'CLIENT001');
    const shipment = shipments.find(s => s.id === req.params.id);

    if (!shipment) {
      return res.status(404).json({ 
        error: 'Shipment not found',
        code: 'NOT_FOUND'
      });
    }

    // Simulate real-time location update
    if (shipment.status === 'In Transit') {
      shipment.currentLocation = calculateCurrentLocation(shipment);
    }

    res.json({
      success: true,
      data: shipment
    });

  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch shipment',
      code: 'FETCH_ERROR'
    });
  }
});

// GET tracking information by tracking number
router.get('/track/:trackingNumber', authenticateToken, (req, res) => {
  try {
    // Search across all clients (in production, this would be a database query)
    let foundShipment = null;
    
    for (const clientId in shipmentsCache) {
      const shipment = shipmentsCache[clientId].find(
        s => s.trackingNumber === req.params.trackingNumber
      );
      if (shipment) {
        foundShipment = shipment;
        break;
      }
    }

    if (!foundShipment) {
      return res.status(404).json({ 
        error: 'Tracking number not found',
        code: 'NOT_FOUND'
      });
    }

    // Return limited tracking information
    res.json({
      success: true,
      data: {
        trackingNumber: foundShipment.trackingNumber,
        status: foundShipment.status,
        statusColor: foundShipment.statusColor,
        statusIcon: foundShipment.statusIcon,
        origin: foundShipment.origin,
        destination: foundShipment.destination,
        estimatedDelivery: foundShipment.estimatedDelivery,
        actualDelivery: foundShipment.actualDelivery,
        events: foundShipment.events,
        currentLocation: foundShipment.status === 'In Transit' 
          ? calculateCurrentLocation(foundShipment) 
          : null
      }
    });

  } catch (error) {
    console.error('Track shipment error:', error);
    res.status(500).json({ 
      error: 'Failed to track shipment',
      code: 'TRACK_ERROR'
    });
  }
});

// GET real-time location for in-transit shipments
router.get('/:id/location', authenticateToken, isolateClientData, (req, res) => {
  try {
    const shipments = getClientShipments(req.clientId || 'CLIENT001');
    const shipment = shipments.find(s => s.id === req.params.id);

    if (!shipment) {
      return res.status(404).json({ 
        error: 'Shipment not found',
        code: 'NOT_FOUND'
      });
    }

    if (shipment.status !== 'In Transit') {
      return res.status(400).json({ 
        error: 'Shipment is not in transit',
        code: 'NOT_IN_TRANSIT'
      });
    }

    const location = calculateCurrentLocation(shipment);
    
    res.json({
      success: true,
      data: {
        shipmentId: shipment.id,
        currentLocation: location,
        progress: calculateProgress(shipment),
        estimatedArrival: shipment.estimatedDelivery,
        lastUpdate: new Date()
      }
    });

  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ 
      error: 'Failed to get location',
      code: 'LOCATION_ERROR'
    });
  }
});

// POST create new shipment
router.post('/', authenticateToken, isolateClientData, (req, res) => {
  try {
    const shipmentData = req.body;
    const clientShipments = getClientShipments(req.clientId || 'CLIENT001');
    
    // Generate new shipment with provided data
    const newShipment = {
      ...generateShipment(clientShipments.length),
      ...shipmentData,
      clientId: req.clientId || 'CLIENT001',
      createdAt: new Date()
    };
    
    // Add to cache
    clientShipments.push(newShipment);
    
    res.status(201).json({
      success: true,
      data: newShipment
    });

  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({ 
      error: 'Failed to create shipment',
      code: 'CREATE_ERROR'
    });
  }
});

// PUT update shipment
router.put('/:id', authenticateToken, isolateClientData, (req, res) => {
  try {
    const shipments = getClientShipments(req.clientId || 'CLIENT001');
    const shipmentIndex = shipments.findIndex(s => s.id === req.params.id);

    if (shipmentIndex === -1) {
      return res.status(404).json({ 
        error: 'Shipment not found',
        code: 'NOT_FOUND'
      });
    }

    // Update shipment
    shipments[shipmentIndex] = {
      ...shipments[shipmentIndex],
      ...req.body,
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: shipments[shipmentIndex]
    });

  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(500).json({ 
      error: 'Failed to update shipment',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE shipment
router.delete('/:id', authenticateToken, isolateClientData, (req, res) => {
  try {
    const shipments = getClientShipments(req.clientId || 'CLIENT001');
    const shipmentIndex = shipments.findIndex(s => s.id === req.params.id);

    if (shipmentIndex === -1) {
      return res.status(404).json({ 
        error: 'Shipment not found',
        code: 'NOT_FOUND'
      });
    }

    // Remove shipment
    shipments.splice(shipmentIndex, 1);

    res.json({
      success: true,
      message: 'Shipment deleted successfully'
    });

  } catch (error) {
    console.error('Delete shipment error:', error);
    res.status(500).json({ 
      error: 'Failed to delete shipment',
      code: 'DELETE_ERROR'
    });
  }
});

// GET shipment documents
router.get('/:id/documents', authenticateToken, isolateClientData, (req, res) => {
  try {
    const shipments = getClientShipments(req.clientId || 'CLIENT001');
    const shipment = shipments.find(s => s.id === req.params.id);

    if (!shipment) {
      return res.status(404).json({ 
        error: 'Shipment not found',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: shipment.documents
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      code: 'FETCH_ERROR'
    });
  }
});

// POST upload document
router.post('/:id/documents', authenticateToken, isolateClientData, (req, res) => {
  try {
    const shipments = getClientShipments(req.clientId || 'CLIENT001');
    const shipment = shipments.find(s => s.id === req.params.id);

    if (!shipment) {
      return res.status(404).json({ 
        error: 'Shipment not found',
        code: 'NOT_FOUND'
      });
    }

    // Simulate document upload
    const newDocument = {
      id: require('crypto').randomBytes(8).toString('hex'),
      name: req.body.name || 'New Document',
      type: req.body.type || 'document',
      icon: 'description',
      uploadDate: new Date(),
      size: '1.2 MB',
      status: 'pending',
      url: `#document-${shipment.id}`
    };

    shipment.documents.push(newDocument);

    res.status(201).json({
      success: true,
      data: newDocument
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ 
      error: 'Failed to upload document',
      code: 'UPLOAD_ERROR'
    });
  }
});

// Helper functions
function calculateAverageTransitTime(shipments) {
  const delivered = shipments.filter(s => s.actualDelivery);
  if (delivered.length === 0) return 0;
  
  const totalDays = delivered.reduce((sum, s) => {
    const transit = (new Date(s.actualDelivery) - new Date(s.createdAt)) / (1000 * 60 * 60 * 24);
    return sum + transit;
  }, 0);
  
  return Math.round(totalDays / delivered.length);
}

function calculateCurrentLocation(shipment) {
  const progress = calculateProgress(shipment);
  const origin = shipment.origin.coordinates;
  const destination = shipment.destination.coordinates;
  
  // Simple linear interpolation between origin and destination
  const lat = origin.lat + (destination.lat - origin.lat) * progress;
  const lng = origin.lng + (destination.lng - origin.lng) * progress;
  
  // Add some randomness for realism
  const variation = 0.5;
  
  return {
    lat: lat + (Math.random() - 0.5) * variation,
    lng: lng + (Math.random() - 0.5) * variation,
    timestamp: new Date(),
    speed: Math.round(Math.random() * 20 + 10), // 10-30 knots
    heading: Math.atan2(destination.lng - origin.lng, destination.lat - origin.lat) * 180 / Math.PI
  };
}

function calculateProgress(shipment) {
  const now = new Date();
  const start = new Date(shipment.createdAt);
  const end = new Date(shipment.estimatedDelivery);
  
  const totalDuration = end - start;
  const elapsed = now - start;
  
  let progress = elapsed / totalDuration;
  
  // Clamp between 0 and 0.9 (never show 100% until delivered)
  return Math.min(Math.max(progress, 0), 0.9);
}

module.exports = router;