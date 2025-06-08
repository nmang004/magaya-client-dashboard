import React from 'react';
import { Box, Skeleton, Card, CardContent, useTheme, alpha } from '@mui/material';

interface SkeletonLoaderProps {
  variant?: 'dashboard' | 'table' | 'card' | 'chart' | 'list';
  count?: number;
  height?: number;
  animation?: 'pulse' | 'wave' | false;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 1,
  height,
  animation = 'wave',
}) => {
  const theme = useTheme();

  const renderDashboardSkeleton = () => (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={40} animation={animation} />
        <Skeleton variant="text" width="60%" height={24} animation={animation} />
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        {[...Array(4)].map((_, index) => (
          <Card key={index} sx={{
            background: alpha(theme.palette.primary.main, 0.02),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} animation={animation} />
                <Skeleton variant="rectangular" width={24} height={24} animation={animation} />
              </Box>
              <Skeleton variant="text" width="80%" height={32} animation={animation} />
              <Skeleton variant="text" width="60%" height={20} animation={animation} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Chart Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" height={32} animation={animation} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2, borderRadius: 2 }} animation={animation} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" height={32} animation={animation} />
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Skeleton variant="circular" width={32} height={32} animation={animation} />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Skeleton variant="text" width="70%" animation={animation} />
                  <Skeleton variant="text" width="50%" animation={animation} />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  const renderTableSkeleton = () => (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="30%" height={32} animation={animation} />
        </Box>
        {[...Array(count || 8)].map((_, index) => (
          <Box key={index} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 2,
            borderBottom: index < (count || 8) - 1 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
          }}>
            <Skeleton variant="circular" width={40} height={40} animation={animation} />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant="text" width="60%" animation={animation} />
              <Skeleton variant="text" width="40%" animation={animation} />
            </Box>
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} animation={animation} />
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  const renderCardSkeleton = () => (
    <>
      {[...Array(count)].map((_, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={48} height={48} animation={animation} />
              <Box sx={{ ml: 2, flex: 1 }}>
                <Skeleton variant="text" width="70%" animation={animation} />
                <Skeleton variant="text" width="50%" animation={animation} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" width="100%" height={height || 120} sx={{ borderRadius: 1 }} animation={animation} />
          </CardContent>
        </Card>
      ))}
    </>
  );

  const renderChartSkeleton = () => (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="40%" height={32} animation={animation} />
          <Skeleton variant="text" width="60%" height={20} animation={animation} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={height || 400} sx={{ borderRadius: 2 }} animation={animation} />
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <>
      {[...Array(count || 6)].map((_, index) => (
        <Box key={index} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          py: 2,
          px: 2,
          mb: 1,
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.6),
        }}>
          <Skeleton variant="circular" width={32} height={32} animation={animation} />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton variant="text" width="80%" animation={animation} />
            <Skeleton variant="text" width="60%" animation={animation} />
          </Box>
          <Skeleton variant="text" width={60} animation={animation} />
        </Box>
      ))}
    </>
  );

  switch (variant) {
    case 'dashboard':
      return renderDashboardSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'chart':
      return renderChartSkeleton();
    case 'list':
      return renderListSkeleton();
    default:
      return renderCardSkeleton();
  }
};

export default SkeletonLoader;