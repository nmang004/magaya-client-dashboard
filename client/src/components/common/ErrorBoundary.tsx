import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Collapse,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  RefreshRounded,
  BugReportRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  HomeRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Log error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentWillUnmount() {
    // Clear any pending timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount >= 3) {
      return; // Maximum retries reached
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: retryCount + 1,
    });

    // Auto-retry with exponential backoff if error persists
    const timeout = setTimeout(() => {
      if (this.state.hasError) {
        this.handleRetry();
      }
    }, Math.pow(2, retryCount) * 1000); // 1s, 2s, 4s

    this.retryTimeouts.push(timeout);
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails, retryCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          showDetails={showDetails}
          retryCount={retryCount}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          onToggleDetails={this.toggleDetails}
        />
      );
    }

    return children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
  onRetry: () => void;
  onGoHome: () => void;
  onToggleDetails: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  showDetails,
  retryCount,
  onRetry,
  onGoHome,
  onToggleDetails,
}) => {
  const theme = useTheme();

  const getErrorMessage = () => {
    if (retryCount >= 3) {
      return "We're experiencing persistent issues. Please try again later or contact support.";
    }
    
    if (error?.name === 'ChunkLoadError') {
      return "There was an issue loading the application. This usually happens after an update.";
    }
    
    if (error?.message?.includes('Network')) {
      return "Unable to connect to our servers. Please check your internet connection.";
    }
    
    return "Something unexpected happened. We're working to fix this issue.";
  };

  const getErrorTitle = () => {
    if (retryCount >= 3) {
      return "Persistent Error";
    }
    
    if (error?.name === 'ChunkLoadError') {
      return "Update Available";
    }
    
    if (error?.message?.includes('Network')) {
      return "Connection Issue";
    }
    
    return "Oops! Something went wrong";
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            boxShadow: theme.customShadows?.card || theme.shadows[8],
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <BugReportRounded
                sx={{
                  fontSize: 80,
                  color: 'error.main',
                  mb: 2,
                }}
              />
            </motion.div>

            <Typography variant="h4" gutterBottom fontWeight={600} color="text.primary">
              {getErrorTitle()}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {getErrorMessage()}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
              {retryCount < 3 && (
                <Button
                  variant="contained"
                  startIcon={<RefreshRounded />}
                  onClick={onRetry}
                  sx={{
                    background: theme.gradients?.primary?.gradient || theme.palette.primary.main,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.customShadows?.primary || theme.shadows[4],
                    },
                  }}
                >
                  Try Again
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<HomeRounded />}
                onClick={onGoHome}
                sx={{
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Go Home
              </Button>
            </Box>

            {retryCount > 0 && (
              <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
                Retry attempt {retryCount} of 3
              </Alert>
            )}

            <Button
              size="small"
              onClick={onToggleDetails}
              endIcon={showDetails ? <ExpandLessRounded /> : <ExpandMoreRounded />}
              sx={{ color: 'text.secondary' }}
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </Button>

            <Collapse in={showDetails}>
              <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Error: {error?.name}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {error?.message}
                </Typography>
                {errorInfo && (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.7rem', mt: 1 }}>
                    {errorInfo.componentStack}
                  </Typography>
                )}
              </Alert>
            </Collapse>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ErrorBoundary;