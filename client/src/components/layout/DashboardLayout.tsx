import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
  alpha,
  Button,
  ListItemAvatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assessment,
  Receipt,
  Settings,
  Person,
  Logout,
  Notifications,
  Search,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  Brightness4,
  Brightness7,
  CheckCircle,
  AttachMoney,
  LocalShipping,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from '../common/SearchBar';

const drawerWidth = 280;

const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Dashboard />,
  },
  {
    title: 'Shipments',
    path: '/shipments',
    icon: <LocalShipping />,
    subItems: [
      { title: 'All Shipments', path: '/shipments' },
      { title: 'In Transit', path: '/shipments?status=in-transit' },
      { title: 'Delivered', path: '/shipments?status=delivered' },
    ],
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: <Assessment />,
  },
  {
    title: 'Transactions',
    path: '/transactions',
    icon: <Receipt />,
  },
];

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
          py: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/wm-stone-logo.svg"
            alt="W.M. Stone Logo"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '180px',
            }}
          />
        </motion.div>
      </Toolbar>
      
      <Divider />
      
      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            background: alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              mr: 2,
            }}
          >
            {user?.companyName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              W.M. Stone Logistics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.includes(item.title);
          
          return (
            <React.Fragment key={item.title}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={hasSubItems ? 'div' : Link}
                  to={hasSubItems ? undefined : item.path}
                  onClick={hasSubItems ? () => toggleExpanded(item.title) : undefined}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    background: isActive
                      ? alpha(theme.palette.primary.main, 0.12)
                      : 'transparent',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.main' : 'text.primary',
                    }}
                  />
                  {hasSubItems && (
                    isExpanded ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
              
              {hasSubItems && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname + location.search === subItem.path;
                      
                      return (
                        <ListItem key={subItem.title} disablePadding sx={{ pl: 2 }}>
                          <ListItemButton
                            component={Link}
                            to={subItem.path}
                            sx={{
                              borderRadius: 2,
                              mb: 0.5,
                              background: isSubActive
                                ? alpha(theme.palette.primary.main, 0.08)
                                : 'transparent',
                              '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.05),
                              },
                            }}
                          >
                            <ListItemText
                              primary={subItem.title}
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: isSubActive ? 600 : 400,
                                color: isSubActive ? 'primary.main' : 'text.secondary',
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider />
      
      {/* Bottom Actions */}
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/settings"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'white',
          color: 'text.primary',
          boxShadow: theme.customShadows.card,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Search Bar */}
          <SearchBar />
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Toggle dark mode">
              <IconButton onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationOpen}>
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Profile">
              <IconButton onClick={handleProfileMenuOpen}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                  {user?.companyName.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: 'none',
                boxShadow: theme.customShadows.card,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have 4 new notifications
          </Typography>
        </Box>
        <Divider />
        <List>
          {[
            { title: 'Shipment Delivered', desc: 'SHP-001234 has been delivered', time: '5 min ago', icon: <CheckCircle color="success" /> },
            { title: 'New Invoice', desc: 'Invoice INV-5678 is ready', time: '1 hour ago', icon: <Receipt color="primary" /> },
            { title: 'Customs Update', desc: 'SHP-002345 cleared customs', time: '2 hours ago', icon: <LocalShipping color="info" /> },
            { title: 'Payment Received', desc: 'Payment for INV-9012 received', time: '3 hours ago', icon: <AttachMoney color="success" /> },
          ].map((notification, index) => (
            <ListItem key={index} button onClick={handleNotificationClose}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.default' }}>
                  {notification.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {notification.desc}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button fullWidth variant="text" color="primary">
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;