import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Collapse,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  LocalShipping,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  DirectionsBoat,
  Flight,
  LocationOn,
  ExpandMore,
  ExpandLess,
  Timeline,
  Notifications,
  Person,
  Business,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';

interface ShipmentEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled' | 'warning' | 'error';
  icon?: string;
  category?: 'transport' | 'customs' | 'documentation' | 'payment' | 'notification';
  details?: {
    temperature?: number;
    humidity?: number;
    coordinates?: [number, number];
    personnel?: string;
    facility?: string;
    reference?: string;
  };
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface ShipmentEventsProps {
  shipment: {
    events?: ShipmentEvent[];
    trackingNumber: string;
  };
  showFilters?: boolean;
  maxHeight?: string | number;
}

const ShipmentEvents: React.FC<ShipmentEventsProps> = ({
  shipment,
  showFilters = true,
  maxHeight = 600,
}) => {
  const theme = useTheme();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock events data for comprehensive demonstration
  const mockEvents: ShipmentEvent[] = [
    {
      id: '1',
      title: 'Shipment Created',
      description: 'Shipment booking confirmed and documentation initiated',
      timestamp: '2024-06-01T08:00:00Z',
      location: 'Shanghai, China',
      status: 'completed',
      category: 'documentation',
      icon: 'description',
      details: {
        personnel: 'Zhang Wei',
        facility: 'Shanghai Logistics Center',
        reference: 'BK-2024-001'
      }
    },
    {
      id: '2',
      title: 'Container Loaded',
      description: 'Cargo loaded into container MSKU1234567',
      timestamp: '2024-06-01T14:30:00Z',
      location: 'Shanghai Port, China',
      status: 'completed',
      category: 'transport',
      icon: 'local_shipping',
      details: {
        temperature: 22,
        humidity: 65,
        coordinates: [31.2304, 121.4737],
        facility: 'Terminal 3, Berth 15'
      }
    },
    {
      id: '3',
      title: 'Customs Clearance',
      description: 'Export customs clearance completed',
      timestamp: '2024-06-02T09:15:00Z',
      location: 'Shanghai Customs, China',
      status: 'completed',
      category: 'customs',
      icon: 'check_circle',
      details: {
        personnel: 'Li Ming',
        reference: 'EXP-2024-SH-4567'
      }
    },
    {
      id: '4',
      title: 'Vessel Departure',
      description: 'Ever Given departed from Shanghai Port',
      timestamp: '2024-06-02T18:45:00Z',
      location: 'Shanghai Port, China',
      status: 'completed',
      category: 'transport',
      icon: 'directions_boat',
      details: {
        coordinates: [31.2304, 121.4737],
        facility: 'Terminal 3'
      }
    },
    {
      id: '5',
      title: 'In Transit',
      description: 'Vessel en route to Los Angeles via Pacific Ocean',
      timestamp: '2024-06-05T12:00:00Z',
      location: 'Pacific Ocean',
      status: 'in_progress',
      category: 'transport',
      icon: 'directions_boat',
      details: {
        coordinates: [35.0, 150.0],
        temperature: 24,
        humidity: 72
      }
    },
    {
      id: '6',
      title: 'Weather Delay',
      description: 'Slight delay due to adverse weather conditions',
      timestamp: '2024-06-08T06:30:00Z',
      location: 'Pacific Ocean',
      status: 'warning',
      category: 'notification',
      icon: 'warning',
      details: {
        coordinates: [33.0, -140.0]
      }
    },
    {
      id: '7',
      title: 'Expected Arrival',
      description: 'Estimated arrival at Los Angeles Port',
      timestamp: '2024-06-15T06:00:00Z',
      location: 'Los Angeles, USA',
      status: 'pending',
      category: 'transport',
      icon: 'schedule',
      details: {
        facility: 'Terminal Island',
        coordinates: [33.7361, -118.2639]
      }
    }
  ];

  const events = shipment.events || mockEvents;

  const getEventIcon = (event: ShipmentEvent) => {
    const iconMap: Record<string, React.ReactNode> = {
      local_shipping: <LocalShipping />,
      directions_boat: <DirectionsBoat />,
      flight: <Flight />,
      check_circle: <CheckCircle />,
      schedule: <Schedule />,
      warning: <Warning />,
      error: <Error />,
      info: <Info />,
      location_on: <LocationOn />,
      description: <Business />,
      notifications: <Notifications />,
    };
    
    return iconMap[event.icon || 'info'] || <Info />;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      completed: theme.palette.success.main,
      in_progress: theme.palette.primary.main,
      pending: theme.palette.warning.main,
      cancelled: theme.palette.error.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
    };
    return colorMap[status] || theme.palette.text.secondary;
  };

  const getCategoryIcon = (category?: string): React.ReactElement => {
    const iconMap: Record<string, React.ReactElement> = {
      transport: <LocalShipping fontSize="small" />,
      customs: <Business fontSize="small" />,
      documentation: <Business fontSize="small" />,
      payment: <Business fontSize="small" />,
      notification: <Notifications fontSize="small" />,
    };
    return iconMap[category || 'notification'] || <Info fontSize="small" />;
  };

  const filteredEvents = events.filter(event => {
    const categoryMatch = filterCategory === 'all' || event.category === filterCategory;
    const statusMatch = filterStatus === 'all' || event.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const categories = ['all', 'transport', 'customs', 'documentation', 'payment', 'notification'];
  const statuses = ['all', 'completed', 'in_progress', 'pending', 'warning', 'error'];

  return (
    <Box>
      {/* Filters */}
      {showFilters && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filter Events
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {categories.map(category => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                variant={filterCategory === category ? 'filled' : 'outlined'}
                color={filterCategory === category ? 'primary' : 'default'}
                size="small"
                onClick={() => setFilterCategory(category)}
                icon={category !== 'all' ? getCategoryIcon(category) : undefined}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {statuses.map(status => (
              <Chip
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                variant={filterStatus === status ? 'filled' : 'outlined'}
                color={filterStatus === status ? 'primary' : 'default'}
                size="small"
                onClick={() => setFilterStatus(status)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Events List */}
      <Paper
        sx={{
          maxHeight,
          overflow: 'auto',
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(10px)',
        }}
      >
        <List sx={{ py: 0 }}>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  py: 2,
                  borderLeft: `4px solid ${getStatusColor(event.status)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: alpha(getStatusColor(event.status), 0.1),
                      color: getStatusColor(event.status),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getEventIcon(event)}
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Chip
                        label={event.status.replace('_', ' ')}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(event.status), 0.1),
                          color: getStatusColor(event.status),
                          fontWeight: 600,
                        }}
                      />
                      {event.category && (
                        <Chip
                          label={event.category}
                          size="small"
                          variant="outlined"
                          icon={getCategoryIcon(event.category)}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {event.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.disabled">
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          ({formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })})
                        </Typography>
                        {event.location && (
                          <Chip
                            label={event.location}
                            size="small"
                            variant="outlined"
                            icon={<LocationOn fontSize="small" />}
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />

                {event.details && (
                  <IconButton
                    onClick={() => setExpandedEvent(
                      expandedEvent === event.id ? null : event.id
                    )}
                    size="small"
                  >
                    {expandedEvent === event.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </ListItem>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedEvent === event.id && event.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Collapse in={expandedEvent === event.id}>
                      <Box sx={{ pl: 8, pr: 2, pb: 2 }}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Event Details
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {event.details.personnel && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person fontSize="small" color="action" />
                                <Typography variant="body2">
                                  Personnel: {event.details.personnel}
                                </Typography>
                              </Box>
                            )}
                            {event.details.facility && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Business fontSize="small" color="action" />
                                <Typography variant="body2">
                                  Facility: {event.details.facility}
                                </Typography>
                              </Box>
                            )}
                            {event.details.reference && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Business fontSize="small" color="action" />
                                <Typography variant="body2">
                                  Reference: {event.details.reference}
                                </Typography>
                              </Box>
                            )}
                            {event.details.temperature && (
                              <Typography variant="body2">
                                Temperature: {event.details.temperature}°C
                              </Typography>
                            )}
                            {event.details.humidity && (
                              <Typography variant="body2">
                                Humidity: {event.details.humidity}%
                              </Typography>
                            )}
                            {event.details.coordinates && (
                              <Typography variant="body2">
                                Coordinates: {event.details.coordinates[0]}, {event.details.coordinates[1]}
                              </Typography>
                            )}
                          </Box>
                        </Paper>
                      </Box>
                    </Collapse>
                  </motion.div>
                )}
              </AnimatePresence>

              {index < filteredEvents.length - 1 && <Divider />}
            </motion.div>
          ))}
        </List>

        {filteredEvents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Timeline sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Try adjusting your filters to see more events
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Summary */}
      <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.04), borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Event Summary
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2">
            Total Events: {events.length}
          </Typography>
          <Typography variant="body2">
            Completed: {events.filter(e => e.status === 'completed').length}
          </Typography>
          <Typography variant="body2">
            In Progress: {events.filter(e => e.status === 'in_progress').length}
          </Typography>
          <Typography variant="body2">
            Pending: {events.filter(e => e.status === 'pending').length}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ShipmentEvents;