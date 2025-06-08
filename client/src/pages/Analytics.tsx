import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  alpha,
  Paper,
  Button,
  TextField,
} from '@mui/material';
import {
  TrendingUp,
  ShowChart,
  PieChart,
  BarChart,
  Download,
  CalendarToday,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { format, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

// Import chart components
import ShipmentTrendsChart from '../components/analytics/ShipmentTrendsChart';
import SimpleTestChart from '../components/analytics/SimpleTestChart';
import RoutePerformanceChart from '../components/analytics/RoutePerformanceChart';
import CarrierAnalytics from '../components/analytics/CarrierAnalytics';
import RevenueChart from '../components/analytics/RevenueChart';
import DeliveryPerformance from '../components/analytics/DeliveryPerformance';
import GeographicDistribution from '../components/analytics/GeographicDistribution';
import KPICards from '../components/analytics/KPICards';
import { GlassCard } from '../components/common/Cards/GlassCard';

// Mock analytics service
const analyticsService = {
  getOverview: () => Promise.resolve({
    data: {
      totalRevenue: 2847500,
      activeShipments: 324,
      onTimeDeliveryRate: 0.942,
      averageTransitTime: 12.3
    }
  }),
  getMonthlyTrends: () => Promise.resolve({
    data: Array.from({ length: 12 }, (_, i) => ({
      month: format(subMonths(new Date(), 11 - i), 'MMM'),
      shipments: Math.floor(Math.random() * 100) + 150,
      revenue: Math.floor(Math.random() * 200000) + 180000,
      onTimeDelivery: (Math.random() * 0.2 + 0.85) * 100 // Convert to percentage
    }))
  }),
  getRoutePerformance: () => Promise.resolve({
    data: [
      { route: 'Shanghai-LA', shipments: 145, onTime: 94.2, avgDays: 18 },
      { route: 'Hamburg-NYC', shipments: 98, onTime: 91.7, avgDays: 12 },
      { route: 'Mumbai-London', shipments: 67, onTime: 88.4, avgDays: 21 },
      { route: 'Tokyo-Seattle', shipments: 89, onTime: 96.1, avgDays: 14 }
    ]
  }),
  getCarrierPerformance: () => Promise.resolve({
    data: [
      { carrier: 'Maersk', shipments: 156, onTime: 95.2, rating: 4.8 },
      { carrier: 'MSC', shipments: 134, onTime: 91.7, rating: 4.6 },
      { carrier: 'CMA CGM', shipments: 98, onTime: 89.3, rating: 4.4 },
      { carrier: 'COSCO', shipments: 87, onTime: 87.1, rating: 4.2 }
    ]
  })
};

const Analytics: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState(subMonths(new Date(), 6));
  const [endDate, setEndDate] = useState(new Date());
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area');

  // Fetch analytics data
  const { data: overview, isLoading: overviewLoading } = useQuery(
    ['analytics', 'overview', timeRange],
    () => analyticsService.getOverview(),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: monthlyTrends, isLoading: trendsLoading } = useQuery(
    ['analytics', 'trends', startDate, endDate],
    () => analyticsService.getMonthlyTrends(),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: routePerformance } = useQuery(
    ['analytics', 'routes'],
    () => analyticsService.getRoutePerformance(),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: carrierPerformance } = useQuery(
    ['analytics', 'carriers'],
    () => analyticsService.getCarrierPerformance(),
    { staleTime: 5 * 60 * 1000 }
  );

  const handleExport = () => {
    // Export analytics data
    toast.success('Analytics report exported successfully');
  };

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newRange: string) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
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
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Comprehensive insights into your shipping operations
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
            >
              Export Report
            </Button>
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* Filters */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={handleTimeRangeChange}
                size="small"
              >
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="month">Month</ToggleButton>
                <ToggleButton value="quarter">Quarter</ToggleButton>
                <ToggleButton value="year">Year</ToggleButton>
                <ToggleButton value="custom">Custom</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            
            {timeRange === 'custom' && (
              <>
                <Grid item>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date || new Date())}
                    slotProps={{
                      textField: {
                        size: 'small'
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date || new Date())}
                    slotProps={{
                      textField: {
                        size: 'small'
                      }
                    }}
                  />
                </Grid>
              </>
            )}
            
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={chartType}
                  label="Chart Type"
                  onChange={(e) => setChartType(e.target.value as any)}
                >
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="bar">Bar</MenuItem>
                  <MenuItem value="area">Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ mb: 4 }}>
        <KPICards data={overview?.data} loading={overviewLoading} />
      </Box>

      {/* Main Charts Grid */}
      <Grid container spacing={3}>
        {/* Shipment Trends */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Shipment Trends
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label="Live"
                      color="success"
                      size="small"
                      icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />}
                    />
                    <IconButton size="small">
                      <ShowChart />
                    </IconButton>
                  </Box>
                </Box>
                <ShipmentTrendsChart
                  data={monthlyTrends?.data || []}
                  chartType={chartType}
                  loading={trendsLoading}
                />
              </CardContent>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Revenue Overview */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Revenue Breakdown
                  </Typography>
                  <IconButton size="small">
                    <PieChart />
                  </IconButton>
                </Box>
                <RevenueChart data={overview?.data} />
              </CardContent>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Route Performance */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Top Routes Performance
                  </Typography>
                  <IconButton size="small">
                    <BarChart />
                  </IconButton>
                </Box>
                <RoutePerformanceChart data={routePerformance?.data || []} />
              </CardContent>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Carrier Analytics */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Carrier Performance
                  </Typography>
                  <IconButton size="small">
                    <TrendingUp />
                  </IconButton>
                </Box>
                <CarrierAnalytics data={carrierPerformance?.data || []} />
              </CardContent>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Delivery Performance */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <DeliveryPerformance timeRange={timeRange} />
          </motion.div>
        </Grid>

        {/* Geographic Distribution */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GeographicDistribution />
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Analytics;