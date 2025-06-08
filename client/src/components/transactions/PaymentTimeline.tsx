import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  Payment,
  Receipt,
  Warning,
  CheckCircle,
  Schedule,
  AttachMoney,
  AccountBalance,
} from '@mui/icons-material';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { GlassCard } from '../common/Cards/GlassCard';

interface PaymentEvent {
  id: string;
  type: 'payment_received' | 'invoice_sent' | 'reminder_sent' | 'overdue' | 'dispute';
  amount?: number;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  invoiceNumber?: string;
}

const PaymentTimeline: React.FC = () => {
  const theme = useTheme();

  // Mock payment events
  const paymentEvents: PaymentEvent[] = [
    {
      id: '1',
      type: 'payment_received',
      amount: 2450.00,
      description: 'Payment received from Acme Corp',
      timestamp: new Date(),
      status: 'success',
      invoiceNumber: 'INV-2024-001',
    },
    {
      id: '2',
      type: 'invoice_sent',
      amount: 1875.50,
      description: 'Invoice sent to Global Trade Ltd',
      timestamp: subDays(new Date(), 1),
      status: 'info',
      invoiceNumber: 'INV-2024-002',
    },
    {
      id: '3',
      type: 'reminder_sent',
      description: 'Payment reminder sent for overdue invoice',
      timestamp: subDays(new Date(), 2),
      status: 'warning',
      invoiceNumber: 'INV-2024-003',
    },
    {
      id: '4',
      type: 'overdue',
      amount: 950.00,
      description: 'Invoice marked as overdue',
      timestamp: subDays(new Date(), 3),
      status: 'error',
      invoiceNumber: 'INV-2024-003',
    },
    {
      id: '5',
      type: 'payment_received',
      amount: 3200.75,
      description: 'Payment received from Ocean Freight Co',
      timestamp: subDays(new Date(), 4),
      status: 'success',
      invoiceNumber: 'INV-2024-004',
    },
  ];

  const getEventIcon = (type: PaymentEvent['type']) => {
    switch (type) {
      case 'payment_received':
        return Payment;
      case 'invoice_sent':
        return Receipt;
      case 'reminder_sent':
        return Schedule;
      case 'overdue':
        return Warning;
      case 'dispute':
        return AccountBalance;
      default:
        return AttachMoney;
    }
  };

  const getEventColor = (status: PaymentEvent['status']) => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getEventBackground = (status: PaymentEvent['status']) => {
    switch (status) {
      case 'success':
        return 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';
      case 'error':
        return 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
      case 'info':
        return 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
      default:
        return 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';
    }
  };

  return (
    <GlassCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Payment Activity
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {paymentEvents.map((event, index) => {
            const IconComponent = getEventIcon(event.type);
            const eventColor = getEventColor(event.status);
            const eventBackground = getEventBackground(event.status);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 3,
                    position: 'relative',
                    '&:not(:last-child)::after': {
                      content: '""',
                      position: 'absolute',
                      left: 22,
                      top: 44,
                      bottom: -12,
                      width: 2,
                      background: alpha(theme.palette.divider, 0.3),
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: eventBackground,
                      boxShadow: `0 4px 14px ${alpha(eventColor, 0.3)}`,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 20 }} />
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {event.description}
                      </Typography>
                      {event.invoiceNumber && (
                        <Chip
                          label={event.invoiceNumber}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {format(event.timestamp, 'MMM dd, yyyy • h:mm a')}
                      </Typography>
                      
                      {event.amount && (
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            color: event.status === 'success' ? theme.palette.success.main : 'text.primary',
                          }}
                        >
                          ${event.amount.toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* View All Link */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View All Activity
          </Typography>
        </Box>
      </CardContent>
    </GlassCard>
  );
};

export default PaymentTimeline;