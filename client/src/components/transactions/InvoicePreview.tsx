import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  Download,
  Email,
  Print,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  invoiceNumber: string;
  type: string;
  shipmentId: string;
  total: number;
  status: string;
  issueDate: string;
  dueDate: string;
  customerName: string;
}

interface InvoicePreviewProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  open,
  onClose,
  transaction,
}) => {
  const theme = useTheme();

  if (!transaction) return null;

  // Mock invoice line items
  const lineItems = [
    {
      id: '1',
      description: 'Ocean Freight - Shanghai to Los Angeles',
      quantity: 1,
      unitPrice: 1850.00,
      total: 1850.00,
    },
    {
      id: '2',
      description: 'Customs Clearance Services',
      quantity: 1,
      unitPrice: 350.00,
      total: 350.00,
    },
    {
      id: '3',
      description: 'Port Handling Charges',
      quantity: 1,
      unitPrice: 150.00,
      total: 150.00,
    },
    {
      id: '4',
      description: 'Documentation Fee',
      quantity: 1,
      unitPrice: 100.00,
      total: 100.00,
    },
  ];

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle fontSize="small" />;
      case 'pending':
        return <Schedule fontSize="small" />;
      case 'overdue':
        return <Warning fontSize="small" />;
      default:
        return undefined;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Invoice Preview
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                    W.M. Stone Logistics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Norfolk, Virginia 23510<br />
                    Phone: (757) 555-0123<br />
                    Email: billing@wmstone.com
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                    {transaction.invoiceNumber}
                  </Typography>
                  <Chip
                    label={transaction.status.toUpperCase()}
                    color={getStatusColor(transaction.status) as any}
                    icon={getStatusIcon(transaction.status)}
                    sx={{ mb: 2 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Invoice Details */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Bill To:
                  </Typography>
                  <Typography variant="body2">
                    {transaction.customerName}<br />
                    123 Business Street<br />
                    Business City, BC 12345<br />
                    Phone: (555) 123-4567
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight={600}>Issue Date:</Typography>
                      <Typography variant="body2">
                        {format(new Date(transaction.issueDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight={600}>Due Date:</Typography>
                      <Typography variant="body2">
                        {format(new Date(transaction.dueDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight={600}>Shipment ID:</Typography>
                      <Typography variant="body2">{transaction.shipmentId}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Line Items */}
            <TableContainer component={Paper} elevation={0} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Totals */}
            <Box sx={{ width: '100%', maxWidth: 300, ml: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax (10%):</Typography>
                <Typography variant="body2">${tax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={600}>Total:</Typography>
                <Typography variant="h6" fontWeight={600}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Payment Instructions */}
            <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Payment Instructions:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please remit payment within 30 days of invoice date. Wire transfer details will be provided upon request.
                For questions regarding this invoice, please contact our billing department at billing@wmstone.com.
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Email />}
          onClick={() => console.log('Email invoice')}
        >
          Email
        </Button>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={() => window.print()}
        >
          Print
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
              opacity: 0.9,
            },
          }}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePreview;