import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { GlassCard } from '../common/Cards/GlassCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';

interface DeliveryPerformanceProps {
  timeRange: string;
}

const DeliveryPerformance: React.FC<DeliveryPerformanceProps> = ({ timeRange }) => {
  const theme = useTheme();

  // Mock delivery performance data
  const deliveryData = [
    { period: 'Week 1', onTime: 94.2, delayed: 5.8, early: 12.3 },
    { period: 'Week 2', onTime: 96.1, delayed: 3.9, early: 15.7 },
    { period: 'Week 3', onTime: 91.8, delayed: 8.2, early: 9.4 },
    { period: 'Week 4', onTime: 93.7, delayed: 6.3, early: 11.2 },
    { period: 'Week 5', onTime: 95.4, delayed: 4.6, early: 14.8 },
    { period: 'Week 6', onTime: 97.2, delayed: 2.8, early: 18.3 },
    { period: 'Week 7', onTime: 92.9, delayed: 7.1, early: 8.7 },
    { period: 'Week 8', onTime: 94.8, delayed: 5.2, early: 13.6 },
  ];

  console.log('Delivery Performance Data:', deliveryData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            color: 'white',
            p: 2,
            borderRadius: 1,
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="caption">
                {entry.name}: {entry.value.toFixed(1)}%
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <GlassCard>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Delivery Performance Trends
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} view
          </Typography>
        </Box>

        <Box sx={{ height: 350, mb: 3 }}>
          <AreaChart width={600} height={350} data={deliveryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="onTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.3} />
            <XAxis 
              dataKey="period" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="onTime"
              stroke="#059669"
              fill="url(#onTimeGradient)"
              strokeWidth={2}
              name="On-Time Delivery"
            />
          </AreaChart>
        </Box>

        {/* Performance Summary */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.success.main + '10',
              border: `1px solid ${theme.palette.success.main}40`,
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.success.main }}>
              94.8%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg On-Time Rate
            </Typography>
          </Box>
          
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.error.main + '10',
              border: `1px solid ${theme.palette.error.main}40`,
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.error.main }}>
              5.2%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Delayed Rate
            </Typography>
          </Box>
          
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.info.main + '10',
              border: `1px solid ${theme.palette.info.main}40`,
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.info.main }}>
              13.0%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Early Delivery Rate
            </Typography>
          </Box>
        </Box>
      </Box>
    </GlassCard>
  );
};

export default DeliveryPerformance;