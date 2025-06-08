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
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  LocalShipping,
  Anchor,
  Assignment,
  Inventory,
  DirectionsBoat,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface ShipmentTimelineProps {
  events: any[];
}

const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ events }) => {
  const theme = useTheme();

  const getEventIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Booking Confirmed': <Assignment />,
      'Container Loaded': <Inventory />,
      'Vessel Departed': <DirectionsBoat />,
      'In Transit': <LocalShipping />,
      'Vessel Arrived': <Anchor />,
      'Delivered': <CheckCircle />,
    };
    return icons[status] || <RadioButtonUnchecked />;
  };

  const getEventColor = (completed: boolean, isLast: boolean) => {
    if (completed) return 'success';
    if (isLast) return 'primary';
    return 'grey';
  };

  return (
    <Timeline position="alternate">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const color = getEventColor(event.completed, isLast);

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align={index % 2 === 0 ? 'right' : 'left'}
                variant="body2"
                color="text.secondary"
              >
                {format(new Date(event.timestamp), 'MMM dd, yyyy')}
                <br />
                {format(new Date(event.timestamp), 'HH:mm')}
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineConnector
                  sx={{
                    bgcolor: index === 0 ? 'transparent' : 
                      events[index - 1].completed ? `${color}.main` : 'grey.300',
                  }}
                />
                <TimelineDot
                  color={color}
                  variant={event.completed ? 'filled' : 'outlined'}
                  sx={{
                    boxShadow: isLast && !event.completed ? 
                      `0 0 0 8px ${alpha(theme.palette.primary.main, 0.12)}` : 
                      'none',
                    ...(isLast && !event.completed && {
                      animation: 'pulse 2s infinite',
                    }),
                  }}
                >
                  {getEventIcon(event.status)}
                </TimelineDot>
                <TimelineConnector
                  sx={{
                    bgcolor: event.completed ? `${color}.main` : 'grey.300',
                    ...(index === events.length - 1 && { bgcolor: 'transparent' }),
                  }}
                />
              </TimelineSeparator>
              
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: event.completed ? 
                        alpha(theme.palette.success.main, 0.08) : 
                        isLast ? 
                          alpha(theme.palette.primary.main, 0.08) : 
                          alpha(theme.palette.grey[500], 0.08),
                      border: `1px solid ${
                        event.completed ? 
                          alpha(theme.palette.success.main, 0.2) : 
                          isLast ? 
                            alpha(theme.palette.primary.main, 0.2) : 
                            alpha(theme.palette.grey[500], 0.2)
                      }`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customShadows?.card || theme.shadows[4],
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {event.status}
                      </Typography>
                      {event.completed && (
                        <Chip
                          label="Completed"
                          size="small"
                          color="success"
                          sx={{ height: 24 }}
                        />
                      )}
                      {isLast && !event.completed && (
                        <Chip
                          label="Current"
                          size="small"
                          color="primary"
                          sx={{ height: 24 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                    {event.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {event.description}
                      </Typography>
                    )}
                  </Paper>
                </motion.div>
              </TimelineContent>
            </TimelineItem>
          </motion.div>
        );
      })}
    </Timeline>
  );
};

export default ShipmentTimeline;