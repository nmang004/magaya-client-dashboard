import React from 'react';
import { Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const SimpleTestChart: React.FC = () => {
  const simpleData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 120 },
    { name: 'Mar', value: 90 },
    { name: 'Apr', value: 150 },
    { name: 'May', value: 130 },
  ];

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={simpleData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Area type="monotone" dataKey="value" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SimpleTestChart;