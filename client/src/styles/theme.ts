import { createTheme, alpha } from '@mui/material/styles';

// W.M. Stone Brand Color Palette
const colors = {
  primary: {
    main: '#1e3a8a',
    light: '#1e40af',
    dark: '#1e293b',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  },
  secondary: {
    main: '#1e40af',
    light: '#3b82f6',
    dark: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  },
  success: {
    main: '#059669',
    light: '#10b981',
    dark: '#047857',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
  warning: {
    main: '#d97706',
    light: '#f59e0b',
    dark: '#b45309',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  },
  error: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
    dark: '#0f172a',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.18)',
  }
};

// Create custom shadows with colored variants
const customShadows = {
  primary: `0 12px 24px -4px ${alpha(colors.primary.main, 0.24)}`,
  secondary: `0 12px 24px -4px ${alpha(colors.secondary.main, 0.24)}`,
  success: `0 12px 24px -4px ${alpha(colors.success.main, 0.24)}`,
  warning: `0 12px 24px -4px ${alpha(colors.warning.main, 0.24)}`,
  error: `0 12px 24px -4px ${alpha(colors.error.main, 0.24)}`,
  card: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    background: colors.background,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: customShadows.primary,
          },
        },
        containedPrimary: {
          background: colors.primary.gradient,
          '&:hover': {
            background: colors.primary.gradient,
            boxShadow: customShadows.primary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: customShadows.card,
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: customShadows.glass,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: customShadows.card,
        },
      },
    },
  },
});

// Add custom properties to theme
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: typeof customShadows;
    gradients: typeof colors;
  }
  interface ThemeOptions {
    customShadows?: typeof customShadows;
    gradients?: typeof colors;
  }
}

theme.customShadows = customShadows;
theme.gradients = colors;