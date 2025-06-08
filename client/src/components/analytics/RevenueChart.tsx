import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RevenueChartProps {
  data: any;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const theme = useTheme();

  // Mock revenue breakdown data
  const revenueData = [
    { name: 'Ocean Freight', value: 45, amount: 1281375 },
    { name: 'Air Freight', value: 25, amount: 711875 },
    { name: 'Customs', value: 15, amount: 427125 },
    { name: 'Trucking', value: 10, amount: 284750 },
    { name: 'Warehousing', value: 5, amount: 142375 },
  ];

  const COLORS = [
    '#1e3a8a', // Primary navy
    '#1e40af', // Secondary blue
    '#059669', // Success green
    '#d97706', // Warning orange
    '#dc2626', // Error red
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.name}
          </Typography>
          <Typography variant="body2">
            ${data.amount.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            {data.value}% of total revenue
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Validate inputs to prevent NaN values
    if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) {
      return null;
    }
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Additional check for NaN values
    if (isNaN(x) || isNaN(y) || isNaN(percent)) {
      return null;
    }

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <Box>
      <Box sx={{ height: 300, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Box>
        {revenueData.map((item, index) => (
          <Box
            key={item.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
              p: 1,
              borderRadius: 1,
              '&:hover': {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: COLORS[index % COLORS.length],
                }}
              />
              <Typography variant="body2" fontWeight={500}>
                {item.name}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight={600}>
                ${item.amount.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.value}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RevenueChart;