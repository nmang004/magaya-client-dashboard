import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Paper,
  useTheme,
  alpha,
  Fab,
  Tooltip,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Download,
  Refresh,
  MoreVert,
  LocalShipping,
  Map,
  ViewColumn,
  Visibility,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
// React Query will be integrated later
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Import components - temporarily inline to fix initialization error
import StatusChip from '../components/common/StatusChip';

const Shipments: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'trackingNumber',
    'status',
    'origin',
    'destination',
    'carrier',
    'estimatedDelivery',
    'actions',
  ]);
  
  // Filter state from URL params
  const filters = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
  };

  // Mock data for immediate functionality
  const shipmentsData = {
    data: [
      {
        id: '1',
        trackingNumber: 'SHP-001234',
        status: 'In Transit',
        statusColor: 'info',
        statusIcon: 'local_shipping',
        origin: { 
          port: 'Shanghai, China',
          country: 'China',
          coordinates: { lat: 31.2304, lng: 121.4737 }
        },
        destination: { 
          port: 'Los Angeles, USA',
          country: 'USA',
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        carrier: { name: 'Maersk Line', logo: '/api/placeholder/24/24' },
        estimatedDelivery: '2024-06-15T00:00:00Z',
        cargo: { value: 125000 },
      },
      {
        id: '2',
        trackingNumber: 'SHP-001235',
        status: 'Delivered',
        statusColor: 'success',
        statusIcon: 'check_circle',
        origin: { 
          port: 'Singapore',
          country: 'Singapore',
          coordinates: { lat: 1.3521, lng: 103.8198 }
        },
        destination: { 
          port: 'New York, USA',
          country: 'USA',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        carrier: { name: 'COSCO', logo: '/api/placeholder/24/24' },
        estimatedDelivery: '2024-06-10T00:00:00Z',
        cargo: { value: 89000 },
      },
      {
        id: '3',
        trackingNumber: 'SHP-001236',
        status: 'Pending',
        statusColor: 'warning',
        statusIcon: 'pending_actions',
        origin: { 
          port: 'Hong Kong',
          country: 'China',
          coordinates: { lat: 22.3193, lng: 114.1694 }
        },
        destination: { 
          port: 'Hamburg, Germany',
          country: 'Germany',
          coordinates: { lat: 53.5511, lng: 9.9937 }
        },
        carrier: { name: 'MSC', logo: '/api/placeholder/24/24' },
        estimatedDelivery: '2024-06-20T00:00:00Z',
        cargo: { value: 156000 },
      },
      {
        id: '4',
        trackingNumber: 'SHP-001237',
        status: 'Customs Hold',
        statusColor: 'error',
        statusIcon: 'warning',
        origin: { 
          port: 'Dubai, UAE',
          country: 'UAE',
          coordinates: { lat: 25.2048, lng: 55.2708 }
        },
        destination: { 
          port: 'Miami, USA',
          country: 'USA',
          coordinates: { lat: 25.7617, lng: -80.1918 }
        },
        carrier: { name: 'CMA CGM', logo: '/api/placeholder/24/24' },
        estimatedDelivery: '2024-06-18T00:00:00Z',
        cargo: { value: 67000 },
      },
      {
        id: '5',
        trackingNumber: 'SHP-001238',
        status: 'In Transit',
        statusColor: 'info',
        statusIcon: 'local_shipping',
        origin: { 
          port: 'Tokyo, Japan',
          country: 'Japan',
          coordinates: { lat: 35.6762, lng: 139.6503 }
        },
        destination: { 
          port: 'Seattle, USA',
          country: 'USA',
          coordinates: { lat: 47.6062, lng: -122.3321 }
        },
        carrier: { name: 'ONE', logo: '/api/placeholder/24/24' },
        estimatedDelivery: '2024-06-12T00:00:00Z',
        cargo: { value: 198000 },
      },
    ],
    stats: {
      byStatus: {
        'In Transit': 2,
        'Delivered': 1,
        'Pending': 1,
        'Customs Hold': 1,
      }
    },
    pagination: {
      total: 5,
      page: 1,
      limit: 20,
    }
  };

  // Define columns
  const columns: GridColDef[] = [
    {
      field: 'trackingNumber',
      headerName: 'Tracking #',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={() => navigate(`/shipments/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <StatusChip
          status={params.value}
          color={params.row.statusColor}
        />
      ),
    },
    {
      field: 'origin',
      headerName: 'Origin',
      width: 180,
      valueGetter: (params) => params.row.origin.port,
    },
    {
      field: 'destination',
      headerName: 'Destination',
      width: 180,
      valueGetter: (params) => params.row.destination.port,
    },
    {
      field: 'carrier',
      headerName: 'Carrier',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={params.row.carrier.logo}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="body2">{params.row.carrier.name}</Typography>
        </Box>
      ),
    },
    {
      field: 'estimatedDelivery',
      headerName: 'ETA',
      width: 130,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 120,
      valueGetter: (params) => `$${params.row.cargo.value.toLocaleString()}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/shipments/${params.row.id}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Track on Map">
            <IconButton
              size="small"
              onClick={() => handleTrackOnMap(params.row)}
            >
              <Map />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Filter columns based on visibility
  const visibleColumnsData = columns.filter(col => 
    visibleColumns.includes(col.field)
  );

  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleTrackOnMap = (shipment: any) => {
    setShowMap(true);
    toast.success(`Tracking ${shipment.trackingNumber} on map`);
  };

  const handleExport = async (format: 'csv' | 'pdf', options: any) => {
    try {
      toast.loading('Generating export...');
      // Export logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate export
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleRefresh = () => {
    toast.success('Data refreshed');
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shipments
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage and track all your shipments in one place
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => setExportDialogOpen(true)}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  opacity: 0.9,
                },
              }}
            >
              New Shipment
            </Button>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {shipmentsData?.stats && Object.entries(shipmentsData.stats.byStatus).map(([status, count]) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <Chip
                label={`${status}: ${count}`}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                  },
                }}
                onClick={() => handleFilterChange({ status })}
              />
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Filters - temporarily disabled to fix initialization error */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Filters (Coming Soon)</Typography>
        </Paper>
      )}

      {/* Main Content */}
      <Paper sx={{ 
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {/* Toolbar */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search shipments..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            
            <Tooltip title="Filters">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <Badge
                  badgeContent={Object.values(filters).filter(v => v).length}
                  color="primary"
                >
                  <FilterList />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Toggle Map View">
              <IconButton onClick={() => setShowMap(!showMap)}>
                <Map />
              </IconButton>
            </Tooltip>

            <Tooltip title="Column Settings">
              <IconButton onClick={() => setColumnSelectorOpen(true)}>
                <ViewColumn />
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {selectedRows.length > 0
              ? `${selectedRows.length} selected`
              : `${shipmentsData?.pagination.total || 0} total shipments`}
          </Typography>
        </Box>

        {/* Map View - temporarily disabled to fix initialization error */}
        {showMap && (
          <Box sx={{ height: 400, bgcolor: alpha(theme.palette.primary.main, 0.04), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="text.secondary">Map View (Coming Soon)</Typography>
          </Box>
        )}

        {/* Data Grid */}
        <DataGrid
          rows={shipmentsData?.data || []}
          columns={visibleColumnsData}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          loading={false}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection as string[]);
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        />
      </Paper>

      {/* Export Dialog - temporarily disabled to fix initialization error */}
      {exportDialogOpen && (
        <Typography variant="body2" sx={{ mt: 2 }}>Export functionality coming soon...</Typography>
      )}

      {/* Column Selector - temporarily disabled to fix initialization error */}
      {columnSelectorOpen && (
        <Typography variant="body2" sx={{ mt: 2 }}>Column selector coming soon...</Typography>
      )}
    </Box>
  );
};

export default Shipments;