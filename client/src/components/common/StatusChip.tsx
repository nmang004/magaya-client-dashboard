import React from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatusChipProps {
  status: string;
  color?: string;
  icon?: string | React.ReactElement;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  color,
  icon,
  size = 'small',
  variant = 'filled',
}) => {
  const theme = useTheme();

  // Convert icon string to actual icon component if needed
  const getIcon = () => {
    if (typeof icon === 'string') {
      // This would require a mapping of icon names to components
      return undefined;
    }
    return icon;
  };

  // Convert theme color names to actual color values
  const getChipColor = () => {
    if (!color) return theme.palette.primary.main;
    
    // Handle W.M. Stone brand colors
    const colorMap: Record<string, string> = {
      'primary': '#1e3a8a',
      'secondary': '#1e40af', 
      'success': '#059669',
      'warning': '#d97706',
      'error': '#dc2626',
      'info': '#2563eb',
    };
    
    // Return mapped color or use the color directly if it's already a hex/rgb value
    return colorMap[color] || color;
  };

  const chipColor = getChipColor();

  return (
    <Chip
      label={status}
      size={size}
      icon={getIcon()}
      sx={{
        fontWeight: 600,
        ...(variant === 'filled' ? {
          bgcolor: alpha(chipColor, 0.12),
          color: chipColor,
          border: `1px solid ${alpha(chipColor, 0.24)}`,
          '& .MuiChip-icon': {
            color: chipColor,
          },
        } : {
          borderColor: chipColor,
          color: chipColor,
          '& .MuiChip-icon': {
            color: chipColor,
          },
        }),
      }}
    />
  );
};

export default StatusChip;