import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      // Set up token refresh timer
      setupTokenRefresh();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    
    // Clear any running timers
    clearTokenRefreshTimer();
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      localStorage.setItem('token', response.token);
      
      // Reset refresh timer
      setupTokenRefresh();
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  // Token refresh logic
  let refreshTimer: NodeJS.Timeout;

  const setupTokenRefresh = () => {
    // Refresh token every 6 days (token expires in 7 days)
    clearTokenRefreshTimer();
    refreshTimer = setTimeout(() => {
      refreshToken();
    }, 6 * 24 * 60 * 60 * 1000);
  };

  const clearTokenRefreshTimer = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};