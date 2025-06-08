import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Paper,
  Button,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
} from '@mui/material';
import {
  Description,
  Download,
  Share,
  Delete,
  MoreVert,
  CloudUpload,
  Visibility,
  Print,
  Edit,
  CheckCircle,
  Schedule,
  Error,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ShipmentDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
  status?: 'approved' | 'pending' | 'rejected';
  uploadedBy?: string;
  version?: number;
}

interface DocumentListProps {
  documents: ShipmentDocument[];
  canEdit?: boolean;
  onDocumentUpload?: (file: File) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentUpdate?: (documentId: string, updates: Partial<ShipmentDocument>) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  canEdit = true,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentUpdate,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<ShipmentDocument | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const getDocumentIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      BOL: <Description sx={{ color: theme.palette.primary.main }} />,
      INV: <Description sx={{ color: theme.palette.success.main }} />,
      PKL: <Description sx={{ color: theme.palette.warning.main }} />,
      COD: <Description sx={{ color: theme.palette.info.main }} />,
      CER: <Description sx={{ color: theme.palette.secondary.main }} />,
      default: <Description sx={{ color: theme.palette.text.secondary }} />,
    };
    return iconMap[type] || iconMap.default;
  };

  const getStatusChip = (status?: string) => {
    if (!status) return null;
    
    const statusConfig = {
      approved: { color: 'success' as const, icon: <CheckCircle fontSize="small" /> },
      pending: { color: 'warning' as const, icon: <Schedule fontSize="small" /> },
      rejected: { color: 'error' as const, icon: <Error fontSize="small" /> },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{ ml: 1 }}
      />
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: ShipmentDocument) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocument(null);
  };

  const handleDownload = (document: ShipmentDocument) => {
    // Simulate download
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
    toast.success(`Downloading ${document.name}`);
    handleMenuClose();
  };

  const handleShare = (document: ShipmentDocument) => {
    if (navigator.share) {
      navigator.share({
        title: document.name,
        text: `Document: ${document.name}`,
        url: document.url,
      });
    } else {
      navigator.clipboard.writeText(document.url);
      toast.success('Document link copied to clipboard');
    }
    handleMenuClose();
  };

  const handleDelete = (document: ShipmentDocument) => {
    if (onDocumentDelete) {
      onDocumentDelete(document.id);
      toast.success(`Deleted ${document.name}`);
    }
    handleMenuClose();
  };

  const handleRename = () => {
    if (selectedDocument && onDocumentUpdate) {
      onDocumentUpdate(selectedDocument.id, { name: newFileName });
      toast.success('Document renamed successfully');
      setRenameDialogOpen(false);
      setNewFileName('');
    }
    handleMenuClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onDocumentUpload) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onDocumentUpload(file);
            toast.success(`Uploaded ${file.name}`);
            setUploadDialogOpen(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const openRenameDialog = () => {
    if (selectedDocument) {
      setNewFileName(selectedDocument.name);
      setRenameDialogOpen(true);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Documents ({documents.length})
        </Typography>
        {canEdit && (
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Document
          </Button>
        )}
      </Box>

      {/* Documents List */}
      {documents.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            border: `2px dashed ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents uploaded
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Upload your shipment documents to keep everything organized
          </Typography>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Upload First Document
            </Button>
          )}
        </Paper>
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon>
                  {getDocumentIcon(document.type)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={600}>
                        {document.name}
                      </Typography>
                      {getStatusChip(document.status)}
                      {document.version && document.version > 1 && (
                        <Chip
                          label={`v${document.version}`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {document.size} • Uploaded {format(new Date(document.uploadDate), 'MMM dd, yyyy')}
                        {document.uploadedBy && ` by ${document.uploadedBy}`}
                      </Typography>
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View">
                      <IconButton size="small" onClick={() => window.open(document.url, '_blank')}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Download">
                      <IconButton size="small" onClick={() => handleDownload(document)}>
                        <Download />
                      </IconButton>
                    </Tooltip>
                    
                    {canEdit && (
                      <Tooltip title="More actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, document)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </motion.div>
          ))}
        </List>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => selectedDocument && handleDownload(selectedDocument)}>
          <Download sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem onClick={() => selectedDocument && handleShare(selectedDocument)}>
          <Share sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={() => selectedDocument && window.print()}>
          <Print sx={{ mr: 1 }} />
          Print
        </MenuItem>
        {canEdit && [
          <MenuItem key="rename" onClick={openRenameDialog}>
            <Edit sx={{ mr: 1 }} />
            Rename
          </MenuItem>,
          <MenuItem key="delete" onClick={() => selectedDocument && handleDelete(selectedDocument)}>
            <Delete sx={{ mr: 1, color: 'error.main' }} />
            Delete
          </MenuItem>
        ]}
      </Menu>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {isUploading ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Uploading document...
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ mt: 2, mb: 1 }}
                />
                <Typography variant="caption">
                  {uploadProgress}% complete
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Choose files to upload
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Select PDF, DOC, or image files up to 10MB
                </Typography>
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    Select Files
                  </Button>
                </label>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Document Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            variant="contained"
            disabled={!newFileName.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentList;