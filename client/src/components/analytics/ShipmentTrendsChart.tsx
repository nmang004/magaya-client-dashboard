import React from 'react';
import { Box, Skeleton, useTheme, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface ShipmentTrendsChartProps {
  data: any[];
  chartType: 'line' | 'bar' | 'area';
  loading?: boolean;
}

const ShipmentTrendsChart: React.FC<ShipmentTrendsChartProps> = ({ 
  data, 
  chartType = 'area', 
  loading 
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ height: 350 }}>
        <Skeleton variant="rectangular" height="100%" />
      </Box>
    );
  }

  // Debug: Check if data exists and has content
  console.log('Chart data:', data);
  
  if (!data || data.length === 0) {
    return (
      <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  // Fallback simple chart if Recharts fails to render
  const FallbackChart = () => (
    <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" color="primary">
        📊 Chart Data Available
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {data.length} data points loaded
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {data.slice(0, 6).map((item, index) => (
          <Box key={index} sx={{ textAlign: 'center', p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">{item.month}</Typography>
            <Typography variant="body2" fontWeight={600}>{item.shipments}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const colors = {
    shipments: '#1e3a8a',
    revenue: '#059669',
    onTimeDelivery: '#2563eb',
  };

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
                {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
                {entry.name === 'On-Time Delivery' ? '%' : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const xAxisProps = {
      dataKey: 'month',
      axisLine: false,
      tickLine: false,
      tick: { fontSize: 12, fill: theme.palette.text.secondary },
    };

    const yAxisProps = {
      axisLine: false,
      tickLine: false,
      tick: { fontSize: 12, fill: theme.palette.text.secondary },
    };

    const gridProps = {
      strokeDasharray: '3 3',
      stroke: theme.palette.divider,
      opacity: 0.3,
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="shipments"
              stroke={colors.shipments}
              strokeWidth={3}
              dot={{ fill: colors.shipments, strokeWidth: 2, r: 4 }}
              name="Shipments"
            />
            <Line
              type="monotone"
              dataKey="onTimeDelivery"
              stroke={colors.onTimeDelivery}
              strokeWidth={3}
              dot={{ fill: colors.onTimeDelivery, strokeWidth: 2, r: 4 }}
              name="On-Time Delivery %"
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="shipments"
              fill={colors.shipments}
              radius={[4, 4, 0, 0]}
              name="Shipments"
            />
            <Bar
              dataKey="revenue"
              fill={colors.revenue}
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        );

      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="shipmentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.shipments} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.shipments} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="shipments"
              stroke={colors.shipments}
              fill="url(#shipmentsGradient)"
              strokeWidth={2}
              name="Shipments"
            />
          </AreaChart>
        );
    }
  };

  // Simple implementation without ResponsiveContainer
  return (
    <Box sx={{ height: 350, width: '100%' }}>
      <AreaChart width={600} height={350} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
        />
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.3} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="shipments"
          stroke="#1e3a8a"
          fill="url(#colorShipments)"
          strokeWidth={2}
        />
      </AreaChart>
    </Box>
  );
};

export default ShipmentTrendsChart;