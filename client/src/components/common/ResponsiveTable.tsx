import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Chip,
  Stack,
  Divider,
  Avatar,
  alpha,
} from '@mui/material';
import {
  ExpandMoreRounded,
  ExpandLessRounded,
  MoreVertRounded,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
  priority?: 'high' | 'medium' | 'low'; // For responsive hiding
  mobile?: boolean; // Show on mobile
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
  mobileCardRenderer?: (row: any, index: number) => React.ReactNode;
  title?: string;
  pagination?: boolean;
  searchable?: boolean;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  mobileCardRenderer,
  title,
  pagination = false,
  searchable = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getVisibleColumns = () => {
    if (isMobile) {
      return columns.filter(col => col.mobile || col.priority === 'high');
    }
    if (isTablet) {
      return columns.filter(col => col.priority !== 'low');
    }
    return columns;
  };

  const renderMobileCard = (row: any, index: number) => {
    if (mobileCardRenderer) {
      return mobileCardRenderer(row, index);
    }

    const isExpanded = expandedRows.has(index);
    const primaryColumn = columns.find(col => col.priority === 'high') || columns[0];
    const secondaryColumns = columns.filter(col => col.id !== primaryColumn.id);

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          sx={{
            mb: 2,
            cursor: onRowClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: onRowClick ? 'translateY(-2px)' : 'none',
              boxShadow: onRowClick ? theme.customShadows?.card : 'none',
            },
          }}
          onClick={() => onRowClick?.(row)}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {primaryColumn.format
                    ? primaryColumn.format(row[primaryColumn.id])
                    : row[primaryColumn.id]
                  }
                </Typography>
                
                {/* Show 2-3 key fields */}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {secondaryColumns.slice(0, 2).map((column) => (
                    <Chip
                      key={column.id}
                      label={`${column.label}: ${
                        column.format
                          ? column.format(row[column.id])
                          : row[column.id]
                      }`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {secondaryColumns.length > 2 && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRowExpansion(index);
                  }}
                >
                  {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                </IconButton>
              )}
            </Box>

            <Collapse in={isExpanded}>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                {secondaryColumns.slice(2).map((column) => (
                  <Box key={column.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {column.label}:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {column.format
                        ? column.format(row[column.id])
                        : row[column.id]
                      }
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderDesktopTable = () => {
    const visibleColumns = getVisibleColumns();

    return (
      <TableContainer component={Paper} sx={{ 
        boxShadow: theme.customShadows?.card,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        {title && (
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          </Box>
        )}
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {data.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                  component={TableRow}
                  hover
                  tabIndex={-1}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.format
                        ? column.format(row[column.id])
                        : row[column.id]
                      }
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {isMobile ? (
        <Box>
          {title && (
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {title}
            </Typography>
          )}
          {data.map((row, index) => renderMobileCard(row, index))}
        </Box>
      ) : (
        renderDesktopTable()
      )}
    </Box>
  );
};

export default ResponsiveTable;