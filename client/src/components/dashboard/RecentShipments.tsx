import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
  Skeleton,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  LocalShipping,
  NavigateNext,
  FiberManualRecord,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface RecentShipmentsProps {
  shipments: any[];
  loading?: boolean;
}

const RecentShipments: React.FC<RecentShipmentsProps> = ({ shipments, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <List>
        {[1, 2, 3, 4, 5].map((i) => (
          <ListItem key={i}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton width="60%" />}
              secondary={<Skeleton width="40%" />}
            />
          </ListItem>
        ))}
      </List>
    );
  }

  if (shipments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <LocalShipping sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography color="text.secondary">No recent shipments</Typography>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'In Transit': '#2563eb',
      'Delivered': '#059669',
      'Pending': '#d97706',
      'Delayed': '#dc2626',
    };
    return statusColors[status] || '#64748b';
  };

  return (
    <List sx={{ py: 0 }}>
      {shipments.map((shipment, index) => (
        <motion.div
          key={shipment.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ListItem
            sx={{
              px: 0,
              py: 2,
              borderBottom: index < shipments.length - 1 ? 1 : 0,
              borderColor: 'divider',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                '& .navigate-icon': {
                  transform: 'translateX(4px)',
                },
              },
            }}
            onClick={() => navigate(`/shipments/${shipment.id}`)}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: alpha(getStatusColor(shipment.status), 0.1),
                  color: getStatusColor(shipment.status),
                }}
              >
                <LocalShipping />
              </Avatar>
            </ListItemAvatar>
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} component="span">
                    {shipment.trackingNumber}
                  </Typography>
                  <FiberManualRecord sx={{ fontSize: 6, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" component="span">
                    {(() => {
                      try {
                        return shipment.createdAt ? format(new Date(shipment.createdAt), 'MMM dd') : 'No date';
                      } catch {
                        return 'Invalid date';
                      }
                    })()}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" component="div">
                    {shipment.origin.port} → {shipment.destination.port}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      label={shipment.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(shipment.status), 0.1),
                        color: getStatusColor(shipment.status),
                        fontWeight: 600,
                        height: 24,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" component="span">
                      ETA: {(() => {
                        try {
                          return shipment.estimatedDelivery ? format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy') : 'TBD';
                        } catch {
                          return 'Invalid date';
                        }
                      })()}
                    </Typography>
                  </Box>
                </Box>
              }
              primaryTypographyProps={{ component: 'div' }}
              secondaryTypographyProps={{ component: 'div' }}
            />
            
            <IconButton
              size="small"
              className="navigate-icon"
              sx={{
                transition: 'transform 0.2s',
              }}
            >
              <NavigateNext />
            </IconButton>
          </ListItem>
        </motion.div>
      ))}
    </List>
  );
};

export default RecentShipments;