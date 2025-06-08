import React from 'react';
import {
  Button,
  IconButton,
  Fab,
  ButtonProps,
  IconButtonProps,
  FabProps,
  useTheme,
  useMediaQuery,
  Box,
  alpha,
} from '@mui/material';
import { motion, MotionProps } from 'framer-motion';

// Enhanced touch-optimized button with proper sizing and feedback
interface TouchButtonProps extends Omit<ButtonProps, 'sx'> {
  touchOptimized?: boolean;
  hapticFeedback?: boolean;
  sx?: any;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  touchOptimized = true,
  hapticFeedback = true,
  sx = {},
  onClick,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback for mobile devices
    if (hapticFeedback && isMobile && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }
    onClick?.(event);
  };

  const touchOptimizedStyles = touchOptimized && isMobile ? {
    minHeight: 48, // WCAG AAA touch target size
    minWidth: 48,
    fontSize: '1rem',
    padding: theme.spacing(1.5, 3),
    borderRadius: 3,
    '&:active': {
      transform: 'scale(0.97)',
      transition: 'transform 0.1s ease-in-out',
    },
  } : {};

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
    >
      <Button
        {...props}
        onClick={handleClick}
        sx={{
          ...touchOptimizedStyles,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.customShadows?.primary || theme.shadows[8],
          },
          ...sx,
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};

// Enhanced touch-optimized icon button
interface TouchIconButtonProps extends Omit<IconButtonProps, 'sx'> {
  touchOptimized?: boolean;
  hapticFeedback?: boolean;
  sx?: any;
}

export const TouchIconButton: React.FC<TouchIconButtonProps> = ({
  children,
  touchOptimized = true,
  hapticFeedback = true,
  sx = {},
  onClick,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback && isMobile && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.(event);
  };

  const touchOptimizedStyles = touchOptimized && isMobile ? {
    width: 48,
    height: 48,
    borderRadius: 2,
    '&:active': {
      transform: 'scale(0.95)',
      transition: 'transform 0.1s ease-in-out',
    },
  } : {};

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      <IconButton
        {...props}
        onClick={handleClick}
        sx={{
          ...touchOptimizedStyles,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(theme.palette.action.hover, 0.08),
            transform: 'scale(1.05)',
          },
          ...sx,
        }}
      >
        {children}
      </IconButton>
    </motion.div>
  );
};

// Enhanced floating action button with better mobile positioning
interface TouchFabProps extends Omit<FabProps, 'sx'> {
  touchOptimized?: boolean;
  hapticFeedback?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  sx?: any;
}

export const TouchFab: React.FC<TouchFabProps> = ({
  children,
  touchOptimized = true,
  hapticFeedback = true,
  position = 'bottom-right',
  sx = {},
  onClick,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback && isMobile && 'vibrate' in navigator) {
      navigator.vibrate(20); // Slightly stronger feedback for primary actions
    }
    onClick?.(event);
  };

  const getPositionStyles = () => {
    const baseBottom = isMobile ? 24 : 32;
    const baseSide = isMobile ? 24 : 32;

    switch (position) {
      case 'bottom-left':
        return { position: 'fixed', bottom: baseBottom, left: baseSide };
      case 'bottom-center':
        return { position: 'fixed', bottom: baseBottom, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
      default:
        return { position: 'fixed', bottom: baseBottom, right: baseSide };
    }
  };

  const touchOptimizedStyles = touchOptimized ? {
    width: isMobile ? 64 : 56,
    height: isMobile ? 64 : 56,
    '&:active': {
      transform: 'scale(0.95)',
      transition: 'transform 0.1s ease-in-out',
    },
  } : {};

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{
        zIndex: theme.zIndex.speedDial,
        ...getPositionStyles(),
      }}
    >
      <Fab
        {...props}
        onClick={handleClick}
        sx={{
          ...touchOptimizedStyles,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: theme.customShadows?.primary || theme.shadows[12],
          },
          ...sx,
        }}
      >
        {children}
      </Fab>
    </motion.div>
  );
};

// Swipeable container for mobile gestures
interface SwipeableContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  sx?: any;
}

export const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) {
    return <Box sx={sx}>{children}</Box>;
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        const { offset } = info;
        
        if (Math.abs(offset.x) > threshold) {
          if (offset.x > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (offset.x < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
        
        if (Math.abs(offset.y) > threshold) {
          if (offset.y > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (offset.y < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }}
      style={{
        cursor: 'grab',
        touchAction: 'pan-x pan-y',
      }}
    >
      <Box sx={sx}>
        {children}
      </Box>
    </motion.div>
  );
};

// Pull-to-refresh component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleRefresh = async () => {
    if (disabled || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };

  if (!isMobile || disabled) {
    return <Box>{children}</Box>;
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.y > threshold) {
          handleRefresh();
        } else {
          setPullDistance(0);
        }
      }}
      onDrag={(_, info) => {
        if (info.offset.y > 0) {
          setPullDistance(Math.min(info.offset.y, threshold * 1.5));
        }
      }}
    >
      {pullDistance > 0 && (
        <Box
          sx={{
            height: pullDistance,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '0 0 16px 16px',
          }}
        >
          <motion.div
            animate={{
              rotate: pullDistance > threshold ? 180 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            ↓
          </motion.div>
        </Box>
      )}
      {children}
    </motion.div>
  );
};