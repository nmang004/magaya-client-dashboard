const express = require('express');
const router = express.Router();
const { authenticateToken, isolateClientData } = require('../middleware/auth');
const { generateAnalytics } = require('../mock-data/generator');

// Cache analytics data
let analyticsCache = {};

// GET analytics overview
router.get('/overview', authenticateToken, isolateClientData, (req, res) => {
  try {
    const clientId = req.clientId || 'CLIENT001';
    
    // Generate or retrieve cached analytics
    if (!analyticsCache[clientId] || shouldRefreshAnalytics(analyticsCache[clientId])) {
      analyticsCache[clientId] = {
        data: generateAnalytics(clientId),
        lastUpdated: new Date()
      };
    }

    res.json({
      success: true,
      data: analyticsCache[clientId].data.overview,
      lastUpdated: analyticsCache[clientId].lastUpdated
    });

  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      code: 'FETCH_ERROR'
    });
  }
});

// GET monthly trends
router.get('/trends/monthly', authenticateToken, isolateClientData, (req, res) => {
  try {
    const clientId = req.clientId || 'CLIENT001';
    const { year = new Date().getFullYear() } = req.query;
    
    if (!analyticsCache[clientId]) {
      analyticsCache[clientId] = {
        data: generateAnalytics(clientId),
        lastUpdated: new Date()
      };
    }

    res.json({
      success: true,
      data: analyticsCache[clientId].data.monthlyData,
      year: parseInt(year)
    });

  } catch (error) {
    console.error('Get monthly trends error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trends',
      code: 'FETCH_ERROR'
    });
  }
});

// GET route performance
router.get('/routes/performance', authenticateToken, isolateClientData, (req, res) => {
  try {
    const clientId = req.clientId || 'CLIENT001';
    
    if (!analyticsCache[clientId]) {
      analyticsCache[clientId] = {
        data: generateAnalytics(clientId),
        lastUpdated: new Date()
      };
    }

    res.json({
      success: true,
      data: analyticsCache[clientId].data.routePerformance
    });

  } catch (error) {
    console.error('Get route performance error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch route performance',
      code: 'FETCH_ERROR'
    });
  }
});

// GET carrier performance
router.get('/carriers/performance', authenticateToken, isolateClientData, (req, res) => {
  try {
    const clientId = req.clientId || 'CLIENT001';
    
    if (!analyticsCache[clientId]) {
      analyticsCache[clientId] = {
        data: generateAnalytics(clientId),
        lastUpdated: new Date()
      };
    }

    res.json({
      success: true,
      data: analyticsCache[clientId].data.carrierPerformance
    });

  } catch (error) {
    console.error('Get carrier performance error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch carrier performance',
      code: 'FETCH_ERROR'
    });
  }
});

// GET shipment distribution
router.get('/shipments/distribution', authenticateToken, isolateClientData, (req, res) => {
  try {
    const clientId = req.clientId || 'CLIENT001';
    
    if (!analyticsCache[clientId]) {
      analyticsCache[clientId] = {
        data: generateAnalytics(clientId),
        lastUpdated: new Date()
      };
    }

    res.json({
      success: true,
      data: {
        byStatus: analyticsCache[clientId].data.shipmentsByStatus,
        topDestinations: analyticsCache[clientId].data.topDestinations
      }
    });

  } catch (error) {
    console.error('Get shipment distribution error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch distribution',
      code: 'FETCH_ERROR'
    });
  }
});

// GET recent activity
router.get('/activity/recent', authenticateToken, isolateClientData, (req, res) => {
  try {
    const clientId = req.clientId || 'CLIENT001';
    const { limit = 10 } = req.query;
    
    if (!analyticsCache[clientId]) {
      analyticsCache[clientId] = {
        data: generateAnalytics(clientId),
        lastUpdated: new Date()
      };
    }

    const activities = analyticsCache[clientId].data.recentActivity
      .slice(0, parseInt(limit))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch activity',
      code: 'FETCH_ERROR'
    });
  }
});

// GET performance metrics
router.get('/performance', authenticateToken, isolateClientData, (req, res) => {
  try {
    const clientId = req.clientId || 'CLIENT001';
    const { period = 'month' } = req.query;
    
    if (!analyticsCache[clientId]) {
      analyticsCache[clientId] = {
        data: generateAnalytics(clientId),
        lastUpdated: new Date()
      };
    }

    // Calculate performance metrics based on period
    const overview = analyticsCache[clientId].data.overview;
    const metrics = {
      shipmentVolume: {
        current: overview.totalShipments,
        previous: Math.floor(overview.totalShipments * 0.85),
        change: 15.2
      },
      onTimeDelivery: {
        current: overview.onTimeDeliveryRate,
        target: 0.95,
        status: overview.onTimeDeliveryRate >= 0.95 ? 'good' : 'warning'
      },
      avgTransitTime: {
        current: overview.averageTransitTime,
        benchmark: 15,
        variance: overview.averageTransitTime - 15
      },
      revenue: {
        current: overview.totalRevenue,
        previous: Math.floor(overview.totalRevenue * 0.9),
        growth: 10.5
      }
    };

    res.json({
      success: true,
      data: metrics,
      period
    });

  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch metrics',
      code: 'FETCH_ERROR'
    });
  }
});

// POST generate custom report
router.post('/reports/generate', authenticateToken, isolateClientData, (req, res) => {
  try {
    const { type, startDate, endDate, metrics } = req.body;
    
    // Simulate report generation
    const report = {
      id: require('crypto').randomBytes(8).toString('hex'),
      type,
      dateRange: { startDate, endDate },
      metrics: metrics || ['shipments', 'revenue', 'performance'],
      generatedAt: new Date(),
      status: 'completed',
      downloadUrl: `/api/analytics/reports/${Date.now()}.pdf`
    };

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      code: 'GENERATE_ERROR'
    });
  }
});

// Helper function to determine if analytics should be refreshed
function shouldRefreshAnalytics(cache) {
  if (!cache || !cache.lastUpdated) return true;
  
  const hoursSinceUpdate = (new Date() - new Date(cache.lastUpdated)) / (1000 * 60 * 60);
  return hoursSinceUpdate > 1; // Refresh every hour
}

module.exports = router;