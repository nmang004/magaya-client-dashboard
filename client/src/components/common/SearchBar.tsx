import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
  ClickAwayListener,
} from '@mui/material';
import {
  Search,
  LocalShipping,
  Receipt,
  TrendingUp,
  History,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

interface SearchResult {
  id: string;
  type: 'shipment' | 'transaction' | 'analytics';
  title: string;
  subtitle: string;
  route: string;
}

const SearchBar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Mock search API
  const { data: searchResults, isLoading } = useQuery(
    ['search', debouncedSearchTerm],
    async () => {
      if (!debouncedSearchTerm) return [];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results
      return [
        {
          id: '1',
          type: 'shipment' as const,
          title: 'SHP-001234',
          subtitle: 'Shanghai → Los Angeles',
          route: '/shipments/SHP-001234',
        },
        {
          id: '2',
          type: 'transaction' as const,
          title: 'INV-5678',
          subtitle: '$12,500 - Pending',
          route: '/transactions/INV-5678',
        },
        {
          id: '3',
          type: 'analytics' as const,
          title: 'Q4 Performance Report',
          subtitle: 'Last updated 2 days ago',
          route: '/analytics?report=q4',
        },
      ].filter(item => 
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    },
    {
      enabled: !!debouncedSearchTerm && open,
    }
  );

  const handleSearch = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => [
      result,
      ...prev.filter(s => s.id !== result.id).slice(0, 4),
    ]);
    
    // Navigate to result
    navigate(result.route);
    setSearchTerm('');
    setOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'shipment':
        return <LocalShipping color="primary" />;
      case 'transaction':
        return <Receipt color="success" />;
      case 'analytics':
        return <TrendingUp color="info" />;
      default:
        return <Search />;
    }
  };

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save recent searches
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  return (
    <>
      <Box ref={anchorRef} sx={{ flexGrow: 1, maxWidth: 600 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search shipments, transactions, analytics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setOpen(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: alpha(theme.palette.common.black, 0.04),
              '&:hover': {
                bgcolor: alpha(theme.palette.common.black, 0.08),
              },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
                boxShadow: theme.customShadows.card,
              },
            },
          }}
        />
      </Box>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper
            elevation={8}
            sx={{
              mt: 1,
              maxHeight: 400,
              overflow: 'auto',
              borderRadius: 2,
            }}
          >
            <AnimatePresence>
              {isLoading ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <CircularProgress size={24} />
                </Box>
              ) : searchTerm && searchResults && searchResults.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <List>
                    <ListItem disabled>
                      <Typography variant="caption" color="text.secondary">
                        Search Results
                      </Typography>
                    </ListItem>
                    {searchResults.map((result) => (
                      <ListItem
                        key={result.id}
                        button
                        onClick={() => handleSearch(result)}
                        sx={{
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        <ListItemIcon>{getIcon(result.type)}</ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.subtitle}
                        />
                        <Chip
                          label={result.type}
                          size="small"
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                </motion.div>
              ) : searchTerm ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No results found for "{searchTerm}"
                  </Typography>
                </Box>
              ) : recentSearches.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <List>
                    <ListItem disabled>
                      <Typography variant="caption" color="text.secondary">
                        Recent Searches
                      </Typography>
                    </ListItem>
                    {recentSearches.map((result) => (
                      <ListItem
                        key={result.id}
                        button
                        onClick={() => handleSearch(result)}
                        sx={{
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <History fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.subtitle}
                        />
                      </ListItem>
                    ))}
                  </List>
                </motion.div>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Start typing to search...
                  </Typography>
                </Box>
              )}
            </AnimatePresence>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default SearchBar;