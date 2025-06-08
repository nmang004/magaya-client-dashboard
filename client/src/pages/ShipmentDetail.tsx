import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Print,
  Share,
  LocalShipping,
  Description,
  Timeline,
  Map,
  AttachMoney,
  NavigateNext,
  ContentCopy,
  CheckCircle,
  Schedule,
  LocationOn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
// React Query will be integrated later
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Import components
import ShipmentTimeline from '../components/shipments/ShipmentTimeline';
import ShipmentMap from '../components/shipments/ShipmentMap';
import DocumentList from '../components/shipments/DocumentList';
import ShipmentEvents from '../components/shipments/ShipmentEvents';
import StatusChip from '../components/common/StatusChip';
import { GlassCard } from '../components/common/Cards/GlassCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ShipmentDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);

  // Mock shipment data for immediate functionality
  const shipmentData = {
    id,
    trackingNumber: `SHP-00${id}`,
    status: 'In Transit',
    statusColor: 'info',
    statusIcon: 'local_shipping',
    lastUpdated: new Date().toISOString(),
    origin: { port: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
    destination: { port: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437 },
    estimatedDelivery: '2024-06-15T00:00:00Z',
    actualDelivery: null,
    carrier: {
      name: 'Maersk Line',
      logo: '/api/placeholder/32/32',
      vesselName: 'Ever Given',
      voyageNumber: 'MG2401'
    },
    cargo: {
      value: 125000,
      weight: 2500,
      weightUnit: 'kg',
      type: 'Electronics',
      description: 'Consumer electronics and components'
    },
    container: {
      number: 'MSKU1234567',
      type: '40ft HC',
      sealNumber: 'SL123456'
    },
    paymentStatus: 'paid',
    shipper: 'Shanghai Electronics Co., Ltd.',
    consignee: 'LA Distribution Center',
    incoterm: 'FOB Shanghai',
    referenceNumber: 'REF-2024-001',
    events: [
      {
        id: '1',
        title: 'Shipment Departed',
        description: 'Container departed from Shanghai Port',
        timestamp: '2024-06-01T08:00:00Z',
        location: 'Shanghai, China',
        status: 'completed' as const,
        icon: 'local_shipping'
      },
      {
        id: '2',
        title: 'In Transit',
        description: 'Vessel on route to Los Angeles',
        timestamp: '2024-06-05T14:30:00Z',
        location: 'Pacific Ocean',
        status: 'in_progress' as const,
        icon: 'directions_boat'
      },
      {
        id: '3',
        title: 'Expected Arrival',
        description: 'Estimated arrival at LA Port',
        timestamp: '2024-06-15T06:00:00Z',
        location: 'Los Angeles, USA',
        status: 'pending' as const,
        icon: 'schedule'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Bill of Lading',
        type: 'BOL',
        size: '245 KB',
        uploadDate: '2024-06-01T00:00:00Z',
        url: '#'
      },
      {
        id: '2',
        name: 'Commercial Invoice',
        type: 'INV',
        size: '189 KB',
        uploadDate: '2024-06-01T00:00:00Z',
        url: '#'
      },
      {
        id: '3',
        name: 'Packing List',
        type: 'PKL',
        size: '156 KB',
        uploadDate: '2024-06-01T00:00:00Z',
        url: '#'
      }
    ]
  };

  const handleCopyTracking = () => {
    if (shipmentData?.trackingNumber) {
      navigator.clipboard.writeText(shipmentData.trackingNumber);
      toast.success('Tracking number copied!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Shipment ${shipmentData?.trackingNumber}`,
        text: `Track shipment ${shipmentData?.trackingNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (!shipmentData) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Shipment not found
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/shipments')}
          sx={{ mt: 2 }}
        >
          Back to Shipments
        </Button>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/dashboard')}
          sx={{ textDecoration: 'none' }}
        >
          Dashboard
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/shipments')}
          sx={{ textDecoration: 'none' }}
        >
          Shipments
        </Link>
        <Typography variant="body2" color="text.primary">
          {shipmentData.trackingNumber}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/shipments')}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" fontWeight={700}>
                  {shipmentData.trackingNumber}
                </Typography>
                <IconButton size="small" onClick={handleCopyTracking}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StatusChip
                  status={shipmentData.status}
                  color={shipmentData.statusColor}
                />
                <Typography variant="body2" color="text.secondary">
                  Last updated: {format(new Date(shipmentData.lastUpdated), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Download Documents">
              <IconButton>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Key Information Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Route
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {shipmentData.origin.port}
                  </Typography>
                  <Box sx={{ my: 1, textAlign: 'center' }}>
                    <NavigateNext sx={{ color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {shipmentData.destination.port}
                  </Typography>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Schedule sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Timeline
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ETA
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(shipmentData.estimatedDelivery), 'MMM dd, yyyy')}
                  </Typography>
                  {shipmentData.actualDelivery && (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Delivered
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {format(new Date(shipmentData.actualDelivery), 'MMM dd, yyyy')}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalShipping sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Carrier
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      src={shipmentData.carrier.logo}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Typography variant="body1" fontWeight={600}>
                      {shipmentData.carrier.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Vessel: {shipmentData.carrier.vesselName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Voyage: {shipmentData.carrier.voyageNumber}
                  </Typography>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoney sx={{ color: 'info.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Value
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    ${shipmentData.cargo.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shipmentData.cargo.weight} {shipmentData.cargo.weightUnit}
                  </Typography>
                  <Chip
                    label={shipmentData.paymentStatus}
                    size="small"
                    color={shipmentData.paymentStatus === 'paid' ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <GlassCard>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
          }}
        >
          <Tab label="Timeline" icon={<Timeline />} iconPosition="start" />
          <Tab label="Tracking Map" icon={<Map />} iconPosition="start" />
          <Tab label="Documents" icon={<Description />} iconPosition="start" />
          <Tab label="Events" icon={<CheckCircle />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <ShipmentTimeline events={shipmentData.events} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ height: 500 }}>
              <ShipmentMap
                shipments={[shipmentData]}
                center={{ lat: shipmentData.origin.lat, lng: shipmentData.origin.lng }}
                zoom={4}
              />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <DocumentList documents={shipmentData.documents} />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <ShipmentEvents shipment={shipmentData} />
          </TabPanel>
        </Box>
      </GlassCard>

      {/* Additional Information */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cargo Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Type"
                    secondary={shipmentData.cargo.type}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Description"
                    secondary={shipmentData.cargo.description}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Container"
                    secondary={`${shipmentData.container.number} (${shipmentData.container.type})`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Seal Number"
                    secondary={shipmentData.container.sealNumber}
                  />
                </ListItem>
              </List>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Parties
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Shipper"
                    secondary={shipmentData.shipper}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Consignee"
                    secondary={shipmentData.consignee}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Incoterm"
                    secondary={shipmentData.incoterm}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reference Number"
                    secondary={shipmentData.referenceNumber}
                  />
                </ListItem>
              </List>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default ShipmentDetail;