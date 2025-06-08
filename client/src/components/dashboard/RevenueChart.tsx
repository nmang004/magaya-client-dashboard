import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface RevenueChartProps {
  revenue: number;
  outstanding: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenue, outstanding }) => {
  const theme = useTheme();

  const data = [
    { name: 'Collected', value: isNaN(revenue - outstanding) ? 0 : revenue - outstanding, color: '#059669' },
    { name: 'Outstanding', value: isNaN(outstanding) ? 0 : outstanding, color: '#d97706' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: theme.customShadows?.card || theme.shadows[4],
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2" color={payload[0].payload.color}>
            ${isNaN(payload[0].value) ? '0' : payload[0].value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Validate inputs to prevent NaN values
    if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) {
      return null;
    }
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Additional check for NaN values
    if (isNaN(x) || isNaN(y) || isNaN(percent)) {
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          ${isNaN(revenue) ? '0' : revenue.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Revenue
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <Box sx={{ mt: 3 }}>
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                bgcolor: alpha(item.color, 0.08),
                border: `1px solid ${alpha(item.color, 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="body2">{item.name}</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                ${isNaN(item.value) ? '0' : item.value.toLocaleString()}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default RevenueChart;