import React from 'react';
import { Box, Typography, LinearProgress, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { GlassCard } from '../common/Cards/GlassCard';
import { Public, TrendingUp } from '@mui/icons-material';

const GeographicDistribution: React.FC = () => {
  const theme = useTheme();

  const regionData = [
    { region: 'Asia-Pacific', shipments: 458, percentage: 35.2, growth: 12.4, flag: '🌏' },
    { region: 'North America', shipments: 389, percentage: 29.8, growth: 8.7, flag: '🌎' },
    { region: 'Europe', shipments: 267, percentage: 20.5, growth: -2.1, flag: '🌍' },
    { region: 'Latin America', shipments: 123, percentage: 9.4, growth: 15.3, flag: '🌎' },
    { region: 'Africa', shipments: 67, percentage: 5.1, growth: 22.8, flag: '🌍' },
  ];

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? theme.palette.success.main : theme.palette.error.main;
  };

  return (
    <GlassCard sx={{ height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Public sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Geographic Distribution
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total shipments across all regions
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
            1,304
          </Typography>
        </Box>

        {regionData.map((region, index) => (
          <motion.div
            key={region.region}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: 18 }}>
                    {region.flag}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {region.region}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {region.shipments}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: getGrowthColor(region.growth),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 12 }} />
                    {region.growth > 0 ? '+' : ''}{region.growth}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Market Share
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {region.percentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={region.percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: `hsl(${200 + index * 30}, 70%, 50%)`,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        ))}

        {/* Regional insights */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: theme.palette.info.main, mb: 1 }}>
            Key Insights
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            • Asia-Pacific leads with 35.2% market share
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            • Africa shows highest growth at 22.8%
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Europe experiencing slight decline (-2.1%)
          </Typography>
        </Box>
      </Box>
    </GlassCard>
  );
};

export default GeographicDistribution;