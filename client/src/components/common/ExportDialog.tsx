import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Divider,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  Description,
  PictureAsPdf,
  Download,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'pdf', options: any) => void;
  selectedCount?: number;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  onExport,
  selectedCount = 0,
}) => {
  const theme = useTheme();
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [options, setOptions] = useState({
    includeAll: true,
    includeDetails: true,
    includeDocuments: false,
    includeSummary: true,
  });

  const handleExport = () => {
    onExport(format, options);
    onClose();
  };

  const handleOptionChange = (option: string) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof options],
    }));
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
          background: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Export Data</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ py: 2 }}>
          {/* Export Scope */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Export Scope
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedCount > 0 
                ? `${selectedCount} selected items will be exported`
                : 'All items matching current filters will be exported'}
            </Typography>
          </Box>

          {/* Format Selection */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Export Format</FormLabel>
            <RadioGroup
              value={format}
              onChange={(e) => setFormat(e.target.value as 'csv' | 'pdf')}
              sx={{ mt: 1 }}
            >
              <motion.div whileHover={{ x: 4 }}>
                <FormControlLabel
                  value="csv"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description color="action" />
                      <Box>
                        <Typography variant="body2">CSV File</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Best for data analysis in Excel
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{
                    p: 2,
                    mb: 1,
                    border: 1,
                    borderColor: format === 'csv' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    bgcolor: format === 'csv' ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                  }}
                />
              </motion.div>
              
              <motion.div whileHover={{ x: 4 }}>
                <FormControlLabel
                  value="pdf"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PictureAsPdf color="action" />
                      <Box>
                        <Typography variant="body2">PDF Report</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Formatted report for printing/sharing
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: format === 'pdf' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    bgcolor: format === 'pdf' ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                  }}
                />
              </motion.div>
            </RadioGroup>
          </FormControl>

          {/* Export Options */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Include in Export
            </Typography>
            <FormGroup sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeDetails}
                    onChange={() => handleOptionChange('includeDetails')}
                  />
                }
                label="Detailed information"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeDocuments}
                    onChange={() => handleOptionChange('includeDocuments')}
                  />
                }
                label="Related documents"
                disabled={format === 'csv'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeSummary}
                    onChange={() => handleOptionChange('includeSummary')}
                  />
                }
                label="Summary statistics"
              />
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            startIcon={<Download />}
            sx={{
              background: theme.gradients?.primary?.gradient || theme.palette.primary.main,
              boxShadow: theme.customShadows?.primary || theme.shadows[4],
            }}
          >
            Export {format.toUpperCase()}
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;