import React from 'react';
import { Grid, Box, Typography, Skeleton, useTheme, alpha } from '@mui/material';
import {
  TrendingUp,
  LocalShipping,
  AttachMoney,
  Speed,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { GlassCard } from '../common/Cards/GlassCard';

interface KPICardsProps {
  data: any;
  loading?: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ data, loading }) => {
  const theme = useTheme();

  const kpis = [
    {
      title: 'Total Revenue',
      value: data?.totalRevenue || 0,
      prefix: '$',
      suffix: '',
      decimals: 0,
      icon: <AttachMoney />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      change: 12.5,
    },
    {
      title: 'Active Shipments',
      value: data?.activeShipments || 0,
      prefix: '',
      suffix: '',
      decimals: 0,
      icon: <LocalShipping />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      change: -5.2,
    },
    {
      title: 'On-Time Delivery',
      value: (data?.onTimeDeliveryRate || 0) * 100,
      prefix: '',
      suffix: '%',
      decimals: 1,
      icon: <CheckCircle />,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
      change: 3.7,
    },
    {
      title: 'Avg Transit Time',
      value: data?.averageTransitTime || 0,
      prefix: '',
      suffix: ' days',
      decimals: 1,
      icon: <Speed />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      change: -8.3,
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {kpis.map((kpi, index) => (
        <Grid item xs={12} sm={6} md={3} key={kpi.title}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <GlassCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: kpi.bgColor,
                      color: kpi.color,
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: kpi.change > 0 ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {kpi.change > 0 ? '+' : ''}{kpi.change}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      vs last period
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {kpi.title}
                </Typography>
                
                <Typography variant="h4" fontWeight={700}>
                  <CountUp
                    start={0}
                    end={kpi.value}
                    duration={2}
                    separator=","
                    decimals={kpi.decimals}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                  />
                </Typography>
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default KPICards;