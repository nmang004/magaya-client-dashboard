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

  const chipColor = color || theme.palette.primary.main;

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