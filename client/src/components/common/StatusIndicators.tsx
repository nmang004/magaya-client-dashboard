import React from 'react';
import {
  Box,
  Chip,
  Typography,
  useTheme,
  alpha,
  LinearProgress,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  CheckCircleRounded,
  RadioButtonUncheckedRounded,
  ScheduleRounded,
  LocalShippingRounded,
  WarningAmberRounded,
  ErrorRounded,
  InfoRounded,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Status Chip with animations and better visual hierarchy
interface StatusChipProps {
  status: 'delivered' | 'in-transit' | 'pending' | 'processing' | 'customs' | 'cancelled' | 'delayed';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showIcon?: boolean;
  variant?: 'filled' | 'outlined' | 'gradient';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'medium',
  animated = true,
  showIcon = true,
  variant = 'filled',
}) => {
  const theme = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered',
          color: theme.palette.success.main,
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          icon: <CheckCircleRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
        };
      case 'in-transit':
        return {
          label: 'In Transit',
          color: theme.palette.info.main,
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          icon: <LocalShippingRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
        };
      case 'pending':
        return {
          label: 'Pending',
          color: theme.palette.warning.main,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          icon: <ScheduleRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
        };
      case 'processing':
        return {
          label: 'Processing',
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          icon: <RadioButtonUncheckedRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        };
      case 'customs':
        return {
          label: 'Customs',
          color: theme.palette.secondary.main,
          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
          icon: <InfoRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
        };
      case 'delayed':
        return {
          label: 'Delayed',
          color: theme.palette.warning.main,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          icon: <WarningAmberRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          icon: <ErrorRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
        };
      default:
        return {
          label: status,
          color: theme.palette.grey[500],
          backgroundColor: alpha(theme.palette.grey[500], 0.1),
          icon: <InfoRounded />,
          gradient: `linear-gradient(135deg, ${theme.palette.grey[500]} 0%, ${theme.palette.grey[600]} 100%)`,
        };
    }
  };

  const config = getStatusConfig();

  const getChipStyles = () => {
    const baseStyles = {
      fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
      height: size === 'small' ? 24 : size === 'large' ? 40 : 32,
      fontWeight: 600,
      borderRadius: 2,
      transition: 'all 0.2s ease-in-out',
    };

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyles,
          background: config.gradient,
          color: 'white',
          border: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
          },
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: config.color,
          border: `2px solid ${config.color}`,
          '&:hover': {
            backgroundColor: config.backgroundColor,
            transform: 'translateY(-1px)',
          },
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: config.backgroundColor,
          color: config.color,
          border: `1px solid ${alpha(config.color, 0.2)}`,
          '&:hover': {
            backgroundColor: alpha(config.color, 0.15),
            transform: 'translateY(-1px)',
          },
        };
    }
  };

  const chipContent = (
    <Chip
      label={config.label}
      icon={showIcon ? React.cloneElement(config.icon, { 
        style: { 
          color: variant === 'gradient' ? 'white' : config.color,
          fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem',
        } 
      }) : undefined}
      sx={getChipStyles()}
    />
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        style={{ display: 'inline-block' }}
      >
        {chipContent}
      </motion.div>
    );
  }

  return chipContent;
};

// Enhanced Progress Indicator
interface ProgressIndicatorProps {
  value: number; // 0-100
  variant?: 'linear' | 'circular' | 'stepped';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  animated?: boolean;
  showValue?: boolean;
  steps?: string[]; // For stepped variant
  label?: string;
  height?: number; // For linear variant
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  variant = 'linear',
  size = 'medium',
  color = 'primary',
  animated = true,
  showValue = true,
  steps = [],
  label,
  height,
}) => {
  const theme = useTheme();

  const getColor = () => theme.palette[color].main;
  const getSize = () => {
    switch (size) {
      case 'small': return { circular: 40, linear: 6 };
      case 'large': return { circular: 80, linear: 12 };
      default: return { circular: 60, linear: 8 };
    }
  };

  const sizes = getSize();

  if (variant === 'circular') {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <motion.div
          initial={animated ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <CircularProgress
            variant="determinate"
            value={value}
            size={sizes.circular}
            thickness={4}
            sx={{
              color: getColor(),
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        </motion.div>
        {showValue && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              fontSize={size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem'}
              fontWeight={600}
            >
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  if (variant === 'stepped' && steps.length > 0) {
    const currentStep = Math.floor((value / 100) * steps.length);
    
    return (
      <Box>
        {label && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {label}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={animated ? { scale: 0 } : {}}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Tooltip title={step}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: index <= currentStep ? getColor() : alpha(getColor(), 0.2),
                      color: index <= currentStep ? 'white' : theme.palette.text.secondary,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    {index + 1}
                  </Box>
                </Tooltip>
              </motion.div>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    backgroundColor: alpha(getColor(), 0.2),
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={animated ? { width: 0 } : { width: index < currentStep ? '100%' : '0%' }}
                    animate={{ width: index < currentStep ? '100%' : '0%' }}
                    transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                    style={{
                      height: '100%',
                      backgroundColor: getColor(),
                    }}
                  />
                </Box>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    );
  }

  // Linear variant
  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {showValue && (
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {Math.round(value)}%
            </Typography>
          )}
        </Box>
      )}
      <motion.div
        initial={animated ? { scaleX: 0 } : {}}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
      >
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: height || sizes.linear,
            borderRadius: (height || sizes.linear) / 2,
            backgroundColor: alpha(getColor(), 0.2),
            '& .MuiLinearProgress-bar': {
              borderRadius: (height || sizes.linear) / 2,
              backgroundColor: getColor(),
            },
          }}
        />
      </motion.div>
    </Box>
  );
};

// Pulse Indicator for real-time status
interface PulseIndicatorProps {
  active?: boolean;
  color?: string;
  size?: number;
  label?: string;
}

export const PulseIndicator: React.FC<PulseIndicatorProps> = ({
  active = false,
  color = '#4caf50',
  size = 12,
  label,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: active ? color : alpha(color, 0.3),
            transition: 'all 0.3s ease-in-out',
          }}
        />
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ 
                scale: [1, 2, 1], 
                opacity: [1, 0, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color,
                opacity: 0.6,
              }}
            />
          )}
        </AnimatePresence>
      </Box>
      {label && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
    </Box>
  );
};