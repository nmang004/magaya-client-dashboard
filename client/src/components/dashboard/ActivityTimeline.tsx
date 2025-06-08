import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Typography,
  Box,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  Description,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const ActivityTimeline: React.FC = () => {
  const theme = useTheme();

  const getColorFromTheme = (colorName: string) => {
    switch (colorName) {
      case 'success':
        return '#059669';
      case 'primary':
        return '#1e3a8a';
      case 'info':
        return '#2563eb';
      case 'warning':
        return '#d97706';
      case 'error':
        return '#dc2626';
      default:
        return '#1e3a8a';
    }
  };

  const activities = [
    {
      id: 1,
      type: 'shipment',
      title: 'Shipment Delivered',
      description: 'SHP-001234 delivered to Los Angeles',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      description: 'Invoice INV-5678 paid in full',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: <Payment />,
      color: 'primary',
    },
    {
      id: 3,
      type: 'document',
      title: 'Document Uploaded',
      description: 'Bill of Lading uploaded for SHP-002345',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000),
      icon: <Description />,
      color: 'info',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Customs Hold',
      description: 'SHP-003456 held at customs for inspection',
      time: new Date(Date.now() - 8 * 60 * 60 * 1000),
      icon: <Warning />,
      color: 'warning',
    },
    {
      id: 5,
      type: 'shipment',
      title: 'Shipment Departed',
      description: 'SHP-004567 departed from Shanghai',
      time: new Date(Date.now() - 12 * 60 * 60 * 1000),
      icon: <LocalShipping />,
      color: 'primary',
    },
  ];

  return (
    <Timeline position="right" sx={{ px: 0 }}>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ flex: 0.3, px: 1 }}
              color="text.secondary"
              variant="caption"
            >
              {format(activity.time, 'HH:mm')}
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  bgcolor: alpha(getColorFromTheme(activity.color), 0.1),
                  color: getColorFromTheme(activity.color),
                  boxShadow: 'none',
                  border: `2px solid ${alpha(getColorFromTheme(activity.color), 0.3)}`,
                }}
              >
                {activity.icon}
              </TimelineDot>
              {index < activities.length - 1 && (
                <TimelineConnector sx={{ bgcolor: 'divider' }} />
              )}
            </TimelineSeparator>
            
            <TimelineContent sx={{ px: 2, py: 1 }}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: alpha(getColorFromTheme(activity.color), 0.05),
                    border: `1px solid ${alpha(getColorFromTheme(activity.color), 0.1)}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(getColorFromTheme(activity.color), 0.08),
                      borderColor: alpha(getColorFromTheme(activity.color), 0.2),
                    },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {activity.description}
                  </Typography>
                </Paper>
              </motion.div>
            </TimelineContent>
          </TimelineItem>
        </motion.div>
      ))}
    </Timeline>
  );
};

export default ActivityTimeline;