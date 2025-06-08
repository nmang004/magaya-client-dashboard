import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  InfoOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GlassCard } from '../common/Cards/GlassCard';

const MotionTableRow = motion(TableRow);

const RoutePerformance: React.FC = () => {
  const theme = useTheme();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const routes = [
    {
      id: 1,
      route: 'Shanghai - Los Angeles',
      shipments: 145,
      avgTransitTime: 15.2,
      onTimeRate: 92,
      trend: 5.2,
      revenue: 458000,
    },
    {
      id: 2,
      route: 'Singapore - Rotterdam',
      shipments: 98,
      avgTransitTime: 28.5,
      onTimeRate: 88,
      trend: -2.1,
      revenue: 312000,
    },
    {
      id: 3,
      route: 'Hong Kong - Hamburg',
      shipments: 76,
      avgTransitTime: 32.1,
      onTimeRate: 85,
      trend: 0,
      revenue: 285000,
    },
    {
      id: 4,
      route: 'Dubai - New York',
      shipments: 64,
      avgTransitTime: 22.8,
      onTimeRate: 94,
      trend: 8.5,
      revenue: 198000,
    },
    {
      id: 5,
      route: 'Tokyo - Los Angeles',
      shipments: 52,
      avgTransitTime: 12.5,
      onTimeRate: 96,
      trend: 3.2,
      revenue: 175000,
    },
  ];

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp sx={{ fontSize: 16 }} />;
    if (trend < 0) return <TrendingDown sx={{ fontSize: 16 }} />;
    return <Remove sx={{ fontSize: 16 }} />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <GlassCard>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Top Route Performance
          </Typography>
          <Tooltip title="Performance metrics for your most active shipping routes">
            <IconButton size="small">
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Route</TableCell>
                <TableCell align="center">Shipments</TableCell>
                <TableCell align="center">Avg Transit Time</TableCell>
                <TableCell align="center">On-Time Rate</TableCell>
                <TableCell align="center">Trend</TableCell>
                <TableCell align="right">Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route, index) => (
                <MotionTableRow
                  key={route.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredRow(route.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{
                    backgroundColor: hoveredRow === route.id
                      ? alpha(theme.palette.primary.main, 0.04)
                      : 'transparent',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {route.route}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="body2">{route.shipments}</Typography>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2">{route.avgTransitTime} days</Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={route.onTimeRate}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: theme.palette.success.main,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {route.onTimeRate}%
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        color: getTrendColor(route.trend),
                      }}
                    >
                      {getTrendIcon(route.trend)}
                      <Typography variant="body2" fontWeight={600}>
                        {Math.abs(route.trend)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ${route.revenue.toLocaleString()}
                    </Typography>
                  </TableCell>
                  </MotionTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </GlassCard>
  );
};

export default RoutePerformance;