import React from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Close, FilterList, Clear } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ShipmentFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onClose: () => void;
}

const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({
  filters,
  onFilterChange,
  onClose,
}) => {
  const theme = useTheme();

  const handleClearAll = () => {
    onFilterChange({
      search: '',
      status: '',
      origin: '',
      destination: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        background: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={handleClearAll}
            disabled={activeFiltersCount === 0}
          >
            Clear All
          </Button>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Customs Hold">Customs Hold</MenuItem>
              <MenuItem value="Delayed">Delayed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Origin"
            value={filters.origin}
            onChange={(e) => onFilterChange({ ...filters, origin: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Destination"
            value={filters.destination}
            onChange={(e) => onFilterChange({ ...filters, destination: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Carrier"
            value={filters.carrier || ''}
            onChange={(e) => onFilterChange({ ...filters, carrier: e.target.value })}
            placeholder="Search carriers..."
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Date From"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Date To"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority || ''}
              label="Priority"
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Min Value ($)"
            type="number"
            value={filters.minValue || ''}
            onChange={(e) => onFilterChange({ ...filters, minValue: e.target.value })}
            placeholder="0"
          />
        </Grid>
      </Grid>

      {/* Quick Filter Chips */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Quick Filters:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { label: 'In Transit', key: 'status', value: 'In Transit' },
            { label: 'Delivered Today', key: 'deliveredToday', value: 'true' },
            { label: 'High Priority', key: 'priority', value: 'High' },
            { label: 'Delayed', key: 'status', value: 'Delayed' },
            { label: 'Customs Hold', key: 'status', value: 'Customs Hold' },
          ].map((quickFilter) => (
            <motion.div
              key={quickFilter.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Chip
                label={quickFilter.label}
                size="small"
                variant={filters[quickFilter.key] === quickFilter.value ? 'filled' : 'outlined'}
                color={filters[quickFilter.key] === quickFilter.value ? 'primary' : 'default'}
                onClick={() => {
                  const newValue = filters[quickFilter.key] === quickFilter.value ? '' : quickFilter.value;
                  onFilterChange({ ...filters, [quickFilter.key]: newValue });
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: filters[quickFilter.key] === quickFilter.value 
                      ? alpha(theme.palette.primary.main, 0.8)
                      : alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default ShipmentFilters;