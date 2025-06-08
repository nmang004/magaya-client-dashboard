import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  alpha,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  VolumeUpRounded,
  VolumeOffRounded,
  AccessibilityNewRounded,
  KeyboardReturnRounded,
} from '@mui/icons-material';

// Skip to content link for keyboard navigation
export const SkipToContent: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        position: 'absolute',
        top: -40,
        left: theme.spacing(2),
        zIndex: theme.zIndex.tooltip + 1,
        padding: theme.spacing(1, 2),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
        borderRadius: 1,
        fontSize: '0.875rem',
        fontWeight: 600,
        border: `2px solid ${theme.palette.primary.dark}`,
        '&:focus': {
          top: theme.spacing(2),
          outline: `3px solid ${theme.palette.warning.main}`,
          outlineOffset: 2,
        },
      }}
    >
      Skip to main content
    </Box>
  );
};

// Accessible button with enhanced keyboard and screen reader support
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'contained',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  size = 'medium',
  startIcon,
  endIcon,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const theme = useTheme();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsPressed(true);
      if (!disabled && !loading) {
        onClick();
      }
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsPressed(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      startIcon={startIcon}
      endIcon={endIcon}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={isPressed}
      role="button"
      tabIndex={disabled ? -1 : 0}
      sx={{
        minHeight: 44, // WCAG AAA minimum touch target
        minWidth: 44,
        '&:focus-visible': {
          outline: `3px solid ${theme.palette.warning.main}`,
          outlineOffset: 2,
        },
        '&:disabled': {
          cursor: 'not-allowed',
        },
        '&[aria-pressed="true"]': {
          transform: 'scale(0.98)',
        },
      }}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

// Screen reader announcements
interface ScreenReaderAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number; // Clear message after X milliseconds
}

export const ScreenReaderAnnouncement: React.FC<ScreenReaderAnnouncementProps> = ({
  message,
  priority = 'polite',
  clearAfter = 5000,
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);
    
    if (clearAfter > 0) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <Box
      aria-live={priority}
      aria-atomic="true"
      sx={{
        position: 'absolute',
        left: -10000,
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      {currentMessage}
    </Box>
  );
};

// Focus trap for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    firstFocusableRef.current = focusableElements[0];
    lastFocusableRef.current = focusableElements[focusableElements.length - 1];

    // Focus first element when trap becomes active
    firstFocusableRef.current?.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableRef.current) {
          event.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableRef.current) {
          event.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [active]);

  return (
    <div ref={containerRef} style={{ outline: 'none' }}>
      {children}
    </div>
  );
};

// Accessible data table with proper ARIA labels
interface AccessibleTableProps {
  caption: string;
  headers: string[];
  data: any[][];
  sortable?: boolean;
  onSort?: (columnIndex: number) => void;
}

export const AccessibleTable: React.FC<AccessibleTableProps> = ({
  caption,
  headers,
  data,
  sortable = false,
  onSort,
}) => {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const theme = useTheme();

  const handleSort = (columnIndex: number) => {
    if (!sortable || !onSort) return;

    const newDirection = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnIndex);
    setSortDirection(newDirection);
    onSort(columnIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent, columnIndex: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSort(columnIndex);
    }
  };

  return (
    <Box
      component="table"
      role="table"
      aria-label={caption}
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <caption
        style={{
          padding: theme.spacing(2),
          textAlign: 'left',
          fontWeight: 600,
          fontSize: '1.1rem',
          color: theme.palette.text.primary,
        }}
      >
        {caption}
      </caption>
      
      <thead>
        <tr role="row">
          {headers.map((header, index) => (
            <th
              key={index}
              role="columnheader"
              tabIndex={sortable ? 0 : -1}
              onClick={sortable ? () => handleSort(index) : undefined}
              onKeyDown={sortable ? (e) => handleKeyDown(e, index) : undefined}
              aria-sort={
                sortColumn === index
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
              style={{
                padding: theme.spacing(2),
                textAlign: 'left',
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${theme.palette.divider}`,
                cursor: sortable ? 'pointer' : 'default',
                outline: 'none',
              }}
            >
              {header}
              {sortable && sortColumn === index && (
                <span aria-hidden="true">
                  {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} role="row">
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                role="cell"
                style={{
                  padding: theme.spacing(2),
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Box>
  );
};

// Accessibility settings panel
export const AccessibilitySettings: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    if (highContrast) {
      root.style.setProperty('--mui-palette-mode', 'dark');
    }
    
    if (reducedMotion) {
      root.style.setProperty('--motion-duration', '0ms');
    }
    
    root.style.setProperty('--font-size-scale', 
      fontSize === 'small' ? '0.875' : 
      fontSize === 'large' ? '1.125' : 
      fontSize === 'extra-large' ? '1.25' : '1'
    );
  }, [highContrast, reducedMotion, fontSize]);

  return (
    <Box
      role="region"
      aria-labelledby="accessibility-settings-title"
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography
        id="accessibility-settings-title"
        variant="h6"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <AccessibilityNewRounded />
        Accessibility Settings
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AccessibleButton
          onClick={() => setHighContrast(!highContrast)}
          variant={highContrast ? 'contained' : 'outlined'}
          ariaLabel={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
        >
          High Contrast: {highContrast ? 'On' : 'Off'}
        </AccessibleButton>

        <AccessibleButton
          onClick={() => setReducedMotion(!reducedMotion)}
          variant={reducedMotion ? 'contained' : 'outlined'}
          ariaLabel={`${reducedMotion ? 'Disable' : 'Enable'} reduced motion`}
        >
          Reduced Motion: {reducedMotion ? 'On' : 'Off'}
        </AccessibleButton>

        <Box>
          <Typography variant="body2" gutterBottom>
            Font Size:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['small', 'medium', 'large', 'extra-large'].map((size) => (
              <AccessibleButton
                key={size}
                onClick={() => setFontSize(size)}
                variant={fontSize === size ? 'contained' : 'outlined'}
                size="small"
                ariaLabel={`Set font size to ${size}`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </AccessibleButton>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};