import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AttachMoney, 
  Schedule, 
  Warning, 
  TrendingUp,
  AccountBalance,
  Receipt 
} from '@mui/icons-material';
import { GlassCard } from '../common/Cards/GlassCard';

interface TransactionSummaryData {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidThisMonth: number;
  byStatus: {
    paid: number;
    pending: number;
    overdue: number;
    cancelled: number;
  };
}

interface TransactionSummaryProps {
  data?: TransactionSummaryData;
  loading?: boolean;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ data, loading }) => {
  const theme = useTheme();

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: data?.totalRevenue || 0,
      format: 'currency',
      icon: AttachMoney,
      color: theme.palette.primary.main,
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    },
    {
      title: 'Pending Amount',
      value: data?.pendingAmount || 0,
      format: 'currency',
      icon: Schedule,
      color: theme.palette.warning.main,
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    },
    {
      title: 'Overdue Amount',
      value: data?.overdueAmount || 0,
      format: 'currency',
      icon: Warning,
      color: theme.palette.error.main,
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    },
    {
      title: 'Paid This Month',
      value: data?.paidThisMonth || 0,
      format: 'currency',
      icon: TrendingUp,
      color: theme.palette.success.main,
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (isNaN(value)) {
      return format === 'currency' ? '$0' : '0';
    }
    if (format === 'currency') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {summaryCards.map((_, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <GlassCard sx={{ height: 120 }}>
              <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', opacity: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <Grid item xs={12} sm={6} lg={3} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
            >
              <GlassCard
                sx={{
                  height: 120,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    '&::before': {
                      opacity: 0.1,
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: card.gradient,
                    opacity: 0.05,
                    transition: 'opacity 0.3s ease',
                  }
                }}
              >
                <Box sx={{ p: 2, height: '100%', position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {card.title}
                    </Typography>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        background: card.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: card.color,
                      lineHeight: 1.2,
                    }}
                  >
                    {formatValue(card.value, card.format)}
                  </Typography>
                  
                  {/* Growth indicator could be added here */}
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {card.title === 'Paid This Month' ? 'vs last month' : 'total outstanding'}
                    </Typography>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TransactionSummary;