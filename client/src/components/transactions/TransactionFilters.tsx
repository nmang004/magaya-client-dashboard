import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Clear, FilterList } from '@mui/icons-material';

interface FilterState {
  search: string;
  status: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

interface TransactionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onClose,
}) => {
  const theme = useTheme();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      type: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'search') return false; // Search is not counted as a filter
      return value !== '';
    }).length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Collapse in={true}>
      <Box
        sx={{
          p: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          borderTop: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Type Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="invoice">Invoice</MenuItem>
                <MenuItem value="credit-note">Credit Note</MenuItem>
                <MenuItem value="receipt">Receipt</MenuItem>
                <MenuItem value="refund">Refund</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Date From */}
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="From Date"
              value={filters.dateFrom ? new Date(filters.dateFrom) : null}
              onChange={(date) => handleFilterChange('dateFrom', date ? date.toISOString() : '')}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                }
              }}
            />
          </Grid>

          {/* Date To */}
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="To Date"
              value={filters.dateTo ? new Date(filters.dateTo) : null}
              onChange={(date) => handleFilterChange('dateTo', date ? date.toISOString() : '')}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                }
              }}
            />
          </Grid>

          {/* Actions */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={onClose}
              >
                Close
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <FilterList fontSize="small" color="action" />
            {filters.status && (
              <Chip
                label={`Status: ${filters.status}`}
                size="small"
                onDelete={() => handleFilterChange('status', '')}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.type && (
              <Chip
                label={`Type: ${filters.type}`}
                size="small"
                onDelete={() => handleFilterChange('type', '')}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.dateFrom && (
              <Chip
                label={`From: ${new Date(filters.dateFrom).toLocaleDateString()}`}
                size="small"
                onDelete={() => handleFilterChange('dateFrom', '')}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.dateTo && (
              <Chip
                label={`To: ${new Date(filters.dateTo).toLocaleDateString()}`}
                size="small"
                onDelete={() => handleFilterChange('dateTo', '')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default TransactionFilters;