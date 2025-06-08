import React from 'react';
import { Box, Typography, Rating, Chip, useTheme, alpha, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { LocalShipping, Star } from '@mui/icons-material';

interface CarrierAnalyticsProps {
  data: Array<{
    carrier: string;
    shipments: number;
    onTime: number;
    rating: number;
  }>;
}

const CarrierAnalytics: React.FC<CarrierAnalyticsProps> = ({ data }) => {
  const theme = useTheme();

  const getCarrierLogo = (carrier: string) => {
    // Return first letter of carrier name as placeholder
    return carrier.charAt(0);
  };

  const getPerformanceColor = (onTimeRate: number) => {
    if (onTimeRate >= 95) return theme.palette.success.main;
    if (onTimeRate >= 90) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box sx={{ p: 2 }}>
      {data.map((carrier, index) => {
        const performanceColor = getPerformanceColor(carrier.onTime);

        return (
          <motion.div
            key={carrier.carrier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box
              sx={{
                mb: 2,
                p: 2.5,
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.03),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                  transition: 'all 0.2s ease',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                >
                  {getCarrierLogo(carrier.carrier)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {carrier.carrier}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating 
                      value={carrier.rating} 
                      precision={0.1} 
                      size="small" 
                      readOnly 
                      sx={{ color: theme.palette.warning.main }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({carrier.rating})
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${carrier.onTime}% On-Time`}
                  size="small"
                  sx={{
                    bgcolor: alpha(performanceColor, 0.1),
                    color: performanceColor,
                    fontWeight: 600,
                    border: `1px solid ${alpha(performanceColor, 0.2)}`,
                  }}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Shipments
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
                    {carrier.shipments}
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Performance
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: performanceColor }}>
                    {carrier.onTime}%
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Service Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <Star sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                    <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.warning.main }}>
                      {carrier.rating}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Performance indicator bar */}
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 4,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.divider, 0.1),
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${carrier.onTime}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${performanceColor}, ${alpha(performanceColor, 0.7)})`,
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default CarrierAnalytics;