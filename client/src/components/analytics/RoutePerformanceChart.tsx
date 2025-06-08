import React from 'react';
import { Box, Typography, LinearProgress, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface RoutePerformanceChartProps {
  data: Array<{
    route: string;
    shipments: number;
    onTime: number;
    avgDays: number;
  }>;
}

const RoutePerformanceChart: React.FC<RoutePerformanceChartProps> = ({ data }) => {
  const theme = useTheme();

  const getPerformanceColor = (onTimeRate: number) => {
    if (onTimeRate >= 95) return theme.palette.success.main;
    if (onTimeRate >= 90) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getPerformanceLabel = (onTimeRate: number) => {
    if (onTimeRate >= 95) return 'Excellent';
    if (onTimeRate >= 90) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <Box sx={{ p: 2 }}>
      {data.map((route, index) => {
        const performanceColor = getPerformanceColor(route.onTime);
        const performanceLabel = getPerformanceLabel(route.onTime);

        return (
          <motion.div
            key={route.route}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(performanceColor, 0.2)}`,
                '&:hover': {
                  background: alpha(performanceColor, 0.05),
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  {route.route}
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: alpha(performanceColor, 0.1),
                      color: performanceColor,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                    }}
                  >
                    {performanceLabel}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Shipments
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {route.shipments}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    On-Time Rate
                  </Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ color: performanceColor }}>
                    {route.onTime}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Avg Transit
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {route.avgDays} days
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Performance Score
                  </Typography>
                  <Typography variant="caption" sx={{ color: performanceColor, fontWeight: 600 }}>
                    {route.onTime}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={route.onTime}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(performanceColor, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: performanceColor,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default RoutePerformanceChart;