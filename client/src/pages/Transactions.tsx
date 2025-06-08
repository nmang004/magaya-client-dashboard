import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Download,
  Receipt,
  AttachMoney,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  MoreVert,
  Print,
  Email,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import components
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionSummary from '../components/transactions/TransactionSummary';
import PaymentTimeline from '../components/transactions/PaymentTimeline';
import InvoicePreview from '../components/transactions/InvoicePreview';
import { GlassCard } from '../components/common/Cards/GlassCard';

// Mock transaction service
const transactionService = {
  getAll: (filters: any) => Promise.resolve({
    data: [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        type: 'Invoice',
        shipmentId: 'SH-24-0001',
        total: 2450.00,
        status: 'paid',
        issueDate: '2024-01-15',
        dueDate: '2024-02-14',
        customerName: 'Acme Corp',
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        type: 'Invoice',
        shipmentId: 'SH-24-0002',
        total: 1875.50,
        status: 'pending',
        issueDate: '2024-01-20',
        dueDate: '2024-02-19',
        customerName: 'Global Trade Ltd',
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        type: 'Credit Note',
        shipmentId: 'SH-24-0003',
        total: 950.00,
        status: 'overdue',
        issueDate: '2024-01-10',
        dueDate: '2024-02-09',
        customerName: 'Shipping Solutions Inc',
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        type: 'Invoice',
        shipmentId: 'SH-24-0004',
        total: 3200.75,
        status: 'paid',
        issueDate: '2024-01-25',
        dueDate: '2024-02-24',
        customerName: 'Ocean Freight Co',
      },
      {
        id: '5',
        invoiceNumber: 'INV-2024-005',
        type: 'Invoice',
        shipmentId: 'SH-24-0005',
        total: 1650.00,
        status: 'pending',
        issueDate: '2024-01-28',
        dueDate: '2024-02-27',
        customerName: 'International Logistics',
      },
    ],
    summary: {
      totalRevenue: 156750.25,
      pendingAmount: 45230.75,
      overdueAmount: 12450.00,
      paidThisMonth: 89650.50,
      byStatus: {
        paid: 156,
        pending: 23,
        overdue: 8,
        cancelled: 2,
      },
    },
    pagination: {
      total: 189,
      page: 1,
      limit: 10,
    },
  }),
  downloadInvoice: (id: string) => Promise.resolve(),
  markAsPaid: (id: string) => Promise.resolve(),
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );
};

const Transactions: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    dateFrom: '',
    dateTo: '',
  });

  // Fetch transactions
  const { data: transactionsData, isLoading, refetch } = useQuery(
    ['transactions', filters, activeTab],
    () => transactionService.getAll({
      ...filters,
      status: activeTab === 1 ? 'pending' : activeTab === 2 ? 'overdue' : filters.status,
    }),
    { keepPreviousData: true }
  );

  // Define columns
  const columns: GridColDef[] = [
    {
      field: 'invoiceNumber',
      headerName: 'Invoice #',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={() => handleViewInvoice(params.row)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={params.value === 'Invoice' ? 'primary' : 'secondary'}
        />
      ),
    },
    {
      field: 'shipmentId',
      headerName: 'Shipment',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          onClick={() => navigate(`/shipments/${params.row.shipmentId}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'Amount',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight={600}>
          ${params.value.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const statusConfig = {
          paid: { color: 'success', icon: <CheckCircle fontSize="small" /> },
          pending: { color: 'warning', icon: <Schedule fontSize="small" /> },
          overdue: { color: 'error', icon: <Warning fontSize="small" /> },
          cancelled: { color: 'default', icon: null },
        };
        
        const config = statusConfig[params.value as keyof typeof statusConfig];
        
        return (
          <Chip
            label={params.value}
            size="small"
            color={config.color as any}
            icon={config.icon || undefined}
          />
        );
      },
    },
    {
      field: 'issueDate',
      headerName: 'Issue Date',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => handleActionMenu(e, params.row)}
          >
            <MoreVert />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleViewInvoice = (transaction: any) => {
    setSelectedTransaction(transaction);
    setPreviewOpen(true);
  };

  const handleActionMenu = (event: React.MouseEvent<HTMLElement>, transaction: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDownloadInvoice = async () => {
    if (selectedTransaction) {
      try {
        await transactionService.downloadInvoice(selectedTransaction.id);
        toast.success('Invoice downloaded successfully');
      } catch (error) {
        toast.error('Failed to download invoice');
      }
    }
    handleCloseMenu();
  };

  const handleEmailInvoice = () => {
    toast.success('Invoice sent via email');
    handleCloseMenu();
  };

  const handleMarkAsPaid = async () => {
    if (selectedTransaction) {
      try {
        await transactionService.markAsPaid(selectedTransaction.id);
        toast.success('Transaction marked as paid');
        refetch();
      } catch (error) {
        toast.error('Failed to update transaction');
      }
    }
    handleCloseMenu();
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Transactions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage invoices, payments, and financial transactions
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => toast('Export functionality coming soon')}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                  opacity: 0.9,
                },
              }}
            >
              New Invoice
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <TransactionSummary data={transactionsData?.summary} loading={isLoading} />
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <GlassCard>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                px: 2,
              }}
            >
              <Tab label="All Transactions" />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Pending
                    <Chip
                      label={transactionsData?.summary?.byStatus?.pending || 0}
                      size="small"
                      color="warning"
                    />
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Overdue
                    <Chip
                      label={transactionsData?.summary?.byStatus?.overdue || 0}
                      size="small"
                      color="error"
                    />
                  </Box>
                }
              />
            </Tabs>

            {/* Toolbar */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
                
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterList />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {transactionsData?.pagination?.total || 0} transactions
              </Typography>
            </Box>

            {/* Filters */}
            {showFilters && (
              <TransactionFilters
                filters={filters}
                onFilterChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            )}

            {/* Data Grid */}
            <DataGrid
              rows={transactionsData?.data || []}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              autoHeight
              loading={isLoading}
              onRowSelectionModelChange={(newSelection: any) => {
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
              }}
            />
          </GlassCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Payment Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PaymentTimeline />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Receipt />}
                      onClick={() => navigate('/transactions/reconcile')}
                    >
                      Reconcile Payments
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Email />}
                      onClick={() => toast('Send reminders feature coming soon')}
                    >
                      Send Reminders
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={() => toast('Generate statement feature coming soon')}
                    >
                      Generate Statement
                    </Button>
                  </Box>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Box>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleDownloadInvoice}>
          <Download sx={{ mr: 1 }} /> Download PDF
        </MenuItem>
        <MenuItem onClick={handleEmailInvoice}>
          <Email sx={{ mr: 1 }} /> Send via Email
        </MenuItem>
        <MenuItem onClick={() => { handleViewInvoice(selectedTransaction); handleCloseMenu(); }}>
          <Receipt sx={{ mr: 1 }} /> View Details
        </MenuItem>
        {selectedTransaction?.status === 'pending' && (
          <MenuItem onClick={handleMarkAsPaid}>
            <CheckCircle sx={{ mr: 1 }} /> Mark as Paid
          </MenuItem>
        )}
      </Menu>

      {/* Invoice Preview Dialog */}
      <InvoicePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default Transactions;