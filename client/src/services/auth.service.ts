import api from './api';
import { User } from '../types/user.types';

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

interface RefreshResponse {
  success: boolean;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
  },

  refreshToken: async (): Promise<RefreshResponse> => {
    const response = await api.post<RefreshResponse>('/auth/refresh');
    return response.data;
  },
};