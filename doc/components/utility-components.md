# Utility Components

Reusable utility components that enhance functionality and user experience across the application.

## ExportDialog

A comprehensive data export dialog component with format selection, configurable options, and animated form controls.

### Location
`client/src/components/common/ExportDialog.tsx`

### Features
- Multiple export formats (CSV, PDF)
- Configurable export options
- Animated form controls
- Conditional option enabling
- Theme-aware styling
- Export scope indication

### Props
```typescript
interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'pdf', options: any) => void;
  selectedCount?: number;
}
```

### Usage
```tsx
import ExportDialog from '@/components/common/ExportDialog';

const [exportOpen, setExportOpen] = useState(false);

const handleExport = (format: 'csv' | 'pdf', options: any) => {
  console.log('Exporting:', format, options);
  // Implement export logic
};

<ExportDialog
  open={exportOpen}
  onClose={() => setExportOpen(false)}
  onExport={handleExport}
  selectedCount={5}
/>
```

### Export Options
```typescript
interface ExportOptions {
  includeAll: boolean;        // Export all vs selected items
  includeDetails: boolean;    // Include detailed information
  includeDocuments: boolean;  // Include related documents (PDF only)
  includeSummary: boolean;    // Include summary statistics
}
```

## Key Features

### 1. Format Selection
Interactive radio buttons with format descriptions:

- **CSV File**: "Best for data analysis in Excel"
- **PDF Report**: "Formatted report for printing/sharing"

### 2. Dynamic Options
Options change based on selected format:
- **Documents**: Only available for PDF format
- **Details**: Available for both formats
- **Summary**: Available for both formats

### 3. Export Scope Indication
Displays current export scope:
- With selection: "5 selected items will be exported"
- Without selection: "All items matching current filters will be exported"

### 4. Animated Interactions
- **Hover Effects**: Format options slide on hover
- **Button Animation**: Export button scales on interaction
- **Form Transitions**: Smooth state transitions

## Implementation Details

### Format Selection UI
```tsx
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
```

### Conditional Options
```tsx
<FormControlLabel
  control={
    <Checkbox
      checked={options.includeDocuments}
      onChange={() => handleOptionChange('includeDocuments')}
    />
  }
  label="Related documents"
  disabled={format === 'csv'}  // Disabled for CSV format
/>
```

### Export Handler
```tsx
const handleExport = () => {
  onExport(format, options);
  onClose();
};
```

## Integration Examples

### Basic Usage
```tsx
const DataTable = () => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleExport = async (format: 'csv' | 'pdf', options: any) => {
    try {
      const exportData = prepareExportData(selectedItems, options);
      
      if (format === 'csv') {
        downloadCSV(exportData);
      } else {
        generatePDFReport(exportData, options);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <>
      <Button 
        variant="outlined" 
        onClick={() => setExportDialogOpen(true)}
        startIcon={<Download />}
      >
        Export Data
      </Button>
      
      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExport}
        selectedCount={selectedItems.length}
      />
    </>
  );
};
```

### Advanced Export Logic
```tsx
const prepareExportData = (items: any[], options: ExportOptions) => {
  let exportData = options.includeAll ? allItems : items;

  if (!options.includeDetails) {
    exportData = exportData.map(item => ({
      id: item.id,
      name: item.name,
      status: item.status,
      // Only basic fields
    }));
  }

  if (options.includeSummary) {
    exportData.push({
      // Summary row
      id: 'SUMMARY',
      totalItems: exportData.length,
      // ... other summary data
    });
  }

  return exportData;
};

const downloadCSV = (data: any[]) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `export-${Date.now()}.csv`;
  link.click();
  
  window.URL.revokeObjectURL(url);
};

const generatePDFReport = (data: any[], options: ExportOptions) => {
  // PDF generation logic with options
  // Include documents, formatting, etc.
};
```

### Integration with Data Tables
```tsx
const EnhancedDataTable = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [exportOpen, setExportOpen] = useState(false);

  const handleExport = (format: 'csv' | 'pdf', options: any) => {
    const exportItems = options.includeAll 
      ? tableData 
      : tableData.filter(item => selectedRows.includes(item.id));

    exportService.export(format, exportItems, options);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Data Table ({selectedRows.length} selected)
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setExportOpen(true)}
          disabled={tableData.length === 0}
          startIcon={<Download />}
        >
          Export
        </Button>
      </Box>

      <DataGrid
        rows={tableData}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection as string[]);
        }}
      />

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={handleExport}
        selectedCount={selectedRows.length}
      />
    </Box>
  );
};
```

## Styling Features

### Glass Morphism Effect
```tsx
PaperProps={{
  sx: {
    borderRadius: 2,
    background: theme.palette.background.paper,
    backdropFilter: 'blur(10px)',
  },
}}
```

### Format Selection Styling
```tsx
sx={{
  p: 2,
  mb: 1,
  border: 1,
  borderColor: format === 'csv' ? 'primary.main' : 'divider',
  borderRadius: 1,
  bgcolor: format === 'csv' 
    ? alpha(theme.palette.primary.main, 0.04) 
    : 'transparent',
}}
```

### Export Button Styling
```tsx
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
```

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Focus Management**: Logical tab order
- **High Contrast**: Theme-aware colors

## Responsive Design

- **Mobile Optimization**: Touch-friendly controls
- **Flexible Layout**: Adapts to screen size
- **Safe Areas**: Respects mobile safe areas
- **Breakpoint Aware**: Different layouts per device

## Error Handling

```tsx
const handleExport = async (format: 'csv' | 'pdf', options: any) => {
  try {
    setExportLoading(true);
    await exportService.export(format, data, options);
    showNotification('Export completed successfully', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showNotification('Export failed. Please try again.', 'error');
  } finally {
    setExportLoading(false);
    onClose();
  }
};
```

## Performance Considerations

- **Lazy Loading**: Dialog content loads only when opened
- **Memoization**: Prevent unnecessary re-renders
- **Efficient Updates**: Optimized state management
- **Memory Management**: Proper cleanup on unmount