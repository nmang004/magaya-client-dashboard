import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  Close,
  ViewColumn,
  Visibility,
  VisibilityOff,
  DragIndicator,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GridColDef } from '@mui/x-data-grid';

interface ColumnSelectorProps {
  open: boolean;
  onClose: () => void;
  columns: GridColDef[];
  visibleColumns: string[];
  onColumnToggle: (columnId: string) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  open,
  onClose,
  columns,
  visibleColumns,
  onColumnToggle,
}) => {
  const theme = useTheme();

  const handleSelectAll = () => {
    if (visibleColumns.length === columns.length) {
      // Deselect all except essential columns
      const essentialColumns = ['trackingNumber', 'status'];
      essentialColumns.forEach(col => {
        if (!visibleColumns.includes(col)) {
          onColumnToggle(col);
        }
      });
      columns.forEach(col => {
        if (visibleColumns.includes(col.field) && !essentialColumns.includes(col.field)) {
          onColumnToggle(col.field);
        }
      });
    } else {
      // Select all columns
      columns.forEach(col => {
        if (!visibleColumns.includes(col.field)) {
          onColumnToggle(col.field);
        }
      });
    }
  };

  const handleReset = () => {
    const defaultColumns = ['trackingNumber', 'status', 'origin', 'destination', 'carrier', 'estimatedDelivery', 'actions'];
    
    // First deselect all
    columns.forEach(col => {
      if (visibleColumns.includes(col.field) && !defaultColumns.includes(col.field)) {
        onColumnToggle(col.field);
      }
    });
    
    // Then select defaults
    defaultColumns.forEach(col => {
      if (!visibleColumns.includes(col)) {
        onColumnToggle(col);
      }
    });
  };

  const isEssential = (columnId: string) => {
    return ['trackingNumber', 'status'].includes(columnId);
  };

  const getColumnDescription = (column: GridColDef) => {
    const descriptions: Record<string, string> = {
      trackingNumber: 'Unique shipment identifier',
      status: 'Current shipment status',
      origin: 'Shipment origin location',
      destination: 'Shipment destination',
      carrier: 'Shipping carrier information',
      estimatedDelivery: 'Expected delivery date',
      value: 'Cargo value in USD',
      actions: 'Quick action buttons',
    };
    return descriptions[column.field] || 'Column data';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewColumn color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Column Settings
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Summary */}
        <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {visibleColumns.length} of {columns.length} columns visible
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleSelectAll}
            startIcon={visibleColumns.length === columns.length ? <VisibilityOff /> : <Visibility />}
          >
            {visibleColumns.length === columns.length ? 'Hide All' : 'Show All'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleReset}
          >
            Reset to Default
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Column List */}
        <FormGroup>
          {columns.map((column, index) => {
            const isVisible = visibleColumns.includes(column.field);
            const isDisabled = isEssential(column.field);

            return (
              <motion.div
                key={column.field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    mb: 1,
                    background: isVisible 
                      ? alpha(theme.palette.primary.main, 0.04) 
                      : 'transparent',
                    border: isVisible 
                      ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` 
                      : '1px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <DragIndicator 
                    sx={{ 
                      color: 'text.disabled', 
                      mr: 1, 
                      cursor: 'grab',
                      '&:active': { cursor: 'grabbing' }
                    }} 
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isVisible}
                        onChange={() => !isDisabled && onColumnToggle(column.field)}
                        disabled={isDisabled}
                        size="small"
                      />
                    }
                    label={
                      <Box>
                        <Typography 
                          variant="body2" 
                          fontWeight={isVisible ? 600 : 400}
                          color={isDisabled ? 'text.disabled' : 'text.primary'}
                        >
                          {column.headerName}
                          {isDisabled && (
                            <Typography 
                              component="span" 
                              variant="caption" 
                              color="text.disabled"
                              sx={{ ml: 1 }}
                            >
                              (Required)
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getColumnDescription(column)}
                        </Typography>
                      </Box>
                    }
                    sx={{ 
                      flex: 1, 
                      mr: 0,
                      '& .MuiFormControlLabel-label': {
                        width: '100%',
                      },
                    }}
                  />

                  <Typography 
                    variant="caption" 
                    color="text.disabled"
                    sx={{ minWidth: 60, textAlign: 'right' }}
                  >
                    {column.width}px
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </FormGroup>

        {/* Help Text */}
        <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.04), borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Essential columns like Tracking # and Status cannot be hidden. 
            You can drag columns to reorder them in the table.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        >
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnSelector;