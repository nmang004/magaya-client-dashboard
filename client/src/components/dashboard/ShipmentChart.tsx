import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme, alpha, Box, Typography } from '@mui/material';
import { format } from 'date-fns';

interface ShipmentChartProps {
  data: any[];
  height?: number;
}

const ShipmentChart: React.FC<ShipmentChartProps> = ({ data, height = 350 }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: alpha(theme.palette.grey[100], 0.5),
          borderRadius: 1
        }}
      >
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[4],
            borderRadius: 1,
            p: 2,
            minWidth: 200,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: entry.color,
                    mr: 1,
                  }}
                />
                <Typography variant="body2">{entry.name}:</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {entry.value.toLocaleString()}
              </Typography>
            </Box>
          ))}
          {payload[0] && payload[0].payload.onTimeDelivery && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                On-time Delivery: {(payload[0].payload.onTimeDelivery * 100).toFixed(1)}%
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="shipmentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="deliveredGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.4} />
            <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          tickLine={false}
          axisLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          tickLine={false}
          axisLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: alpha(theme.palette.primary.main, 0.05) }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          wrapperStyle={{
            paddingBottom: '20px',
          }}
        />
        <Area
          type="monotone"
          dataKey="shipments"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#shipmentGradient)"
          name="Total Shipments"
        />
        <Area
          type="monotone"
          dataKey="delivered"
          stroke={theme.palette.success.main}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#deliveredGradient)"
          name="Delivered"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ShipmentChart;