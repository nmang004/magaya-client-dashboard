import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  LocalShipping,
  TrendingUp,
  AttachMoney,
  Schedule,
  MoreVert,
  NavigateNext,
  Assessment,
  PendingActions,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// React Query will be integrated with actual services later
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

// Import custom components
import StatCard from '../components/dashboard/StatCard';
import ShipmentChart from '../components/dashboard/ShipmentChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentShipments from '../components/dashboard/RecentShipments';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import RoutePerformance from '../components/dashboard/RoutePerformance';
import { GlassCard } from '../components/common/Cards/GlassCard';
// Services will be implemented later - using mock data for now

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data since services don't exist yet
  const analytics = {
    data: {
      totalShipments: 1247,
      activeShipments: 89,
      deliveredThisMonth: 345,
      onTimeDeliveryRate: 94.2,
      totalRevenue: 1250000,
      outstandingPayments: 85000
    }
  };

  const recentShipments = {
    data: [
      { 
        id: '1', 
        trackingNumber: 'SHP-001234', 
        status: 'In Transit',
        origin: { port: 'Shanghai, China' },
        destination: { port: 'Los Angeles, USA' },
        createdAt: '2024-06-01T00:00:00Z',
        estimatedDelivery: '2024-06-15T00:00:00Z'
      },
      { 
        id: '2', 
        trackingNumber: 'SHP-001235', 
        status: 'Delivered',
        origin: { port: 'Singapore' },
        destination: { port: 'New York, USA' },
        createdAt: '2024-05-28T00:00:00Z',
        estimatedDelivery: '2024-06-10T00:00:00Z'
      },
      { 
        id: '3', 
        trackingNumber: 'SHP-001236', 
        status: 'Pending',
        origin: { port: 'Hong Kong' },
        destination: { port: 'Chicago, USA' },
        createdAt: '2024-06-03T00:00:00Z',
        estimatedDelivery: '2024-06-18T00:00:00Z'
      },
      { 
        id: '4', 
        trackingNumber: 'SHP-001237', 
        status: 'In Transit',
        origin: { port: 'Dubai, UAE' },
        destination: { port: 'Miami, USA' },
        createdAt: '2024-06-02T00:00:00Z',
        estimatedDelivery: '2024-06-16T00:00:00Z'
      },
      { 
        id: '5', 
        trackingNumber: 'SHP-001238', 
        status: 'Delivered',
        origin: { port: 'Tokyo, Japan' },
        destination: { port: 'Seattle, USA' },
        createdAt: '2024-05-30T00:00:00Z',
        estimatedDelivery: '2024-06-12T00:00:00Z'
      }
    ]
  };

  const monthlyTrends = {
    data: [
      { month: 'Jan', shipments: 120, delivered: 115 },
      { month: 'Feb', shipments: 135, delivered: 128 },
      { month: 'Mar', shipments: 148, delivered: 142 },
      { month: 'Apr', shipments: 165, delivered: 159 },
      { month: 'May', shipments: 178, delivered: 171 },
      { month: 'Jun', shipments: 192, delivered: 186 }
    ]
  };

  const handlePeriodMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePeriodMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    handlePeriodMenuClose();
  };

  const statCards = [
    {
      title: 'Total Shipments',
      value: analytics?.data?.totalShipments || 0,
      icon: <LocalShipping />,
      color: '#1e3a8a',
      trend: 12.5,
      onClick: () => navigate('/shipments'),
    },
    {
      title: 'Active Shipments',
      value: analytics?.data?.activeShipments || 0,
      icon: <PendingActions />,
      color: '#d97706',
      trend: -5.2,
      onClick: () => navigate('/shipments?status=in-transit'),
    },
    {
      title: 'Delivered This Month',
      value: analytics?.data?.deliveredThisMonth || 0,
      icon: <CheckCircle />,
      color: '#059669',
      trend: 8.7,
      onClick: () => navigate('/shipments?status=delivered'),
    },
    {
      title: 'On-Time Delivery',
      value: analytics?.data?.onTimeDeliveryRate || 0,
      icon: <Schedule />,
      color: '#2563eb',
      percentage: true,
      trend: 2.3,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      ref={ref}
    >
      <Box sx={{ mb: 4 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Welcome back to W.M. Stone Command Center! Here's what's happening with your logistics operations today.
            </Typography>
          </Box>
          
          <Box>
            <IconButton onClick={handlePeriodMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handlePeriodMenuClose}
            >
              <MenuItem onClick={() => handlePeriodChange('day')}>Today</MenuItem>
              <MenuItem onClick={() => handlePeriodChange('week')}>This Week</MenuItem>
              <MenuItem onClick={() => handlePeriodChange('month')}>This Month</MenuItem>
              <MenuItem onClick={() => handlePeriodChange('year')}>This Year</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  trend={stat.trend}
                  percentage={stat.percentage}
                  loading={false}
                  onClick={stat.onClick}
                  delay={index * 0.1}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            <motion.div variants={itemVariants}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Shipment Trends
                    </Typography>
                    <IconButton size="small">
                      <Assessment />
                    </IconButton>
                  </Box>
                  <ShipmentChart data={monthlyTrends.data} height={350} />
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <GlassCard sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Revenue Overview
                    </Typography>
                    <IconButton size="small">
                      <AttachMoney />
                    </IconButton>
                  </Box>
                  <RevenueChart 
                    revenue={analytics.data.totalRevenue}
                    outstanding={analytics.data.outstandingPayments}
                  />
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Recent Shipments */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Recent Shipments
                    </Typography>
                    <IconButton 
                      size="small"
                      onClick={() => navigate('/shipments')}
                    >
                      <NavigateNext />
                    </IconButton>
                  </Box>
                  <RecentShipments 
                    shipments={recentShipments?.data || []}
                    loading={false}
                  />
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>

          {/* Activity Timeline */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Recent Activity
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {format(new Date(), 'HH:mm')}
                    </Typography>
                  </Box>
                  <ActivityTimeline />
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Route Performance */}
        <Box sx={{ mt: 3 }}>
          <motion.div variants={itemVariants}>
            <RoutePerformance />
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Dashboard;