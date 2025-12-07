/**
 * Authentication Store (Zustand)
 * Manages user authentication state, tokens, and session
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api-client';

interface User {
  id: string;
  email: string;
  displayName: string;
  tenantId: string;
  isActive: boolean;
  roles?: Array<{ id: string; name: string }>;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; displayName: string; tenantId: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.auth.login({ email, password });
          
          if (response.data) {
            const { accessToken, refreshToken, user } = response.data;
            
            apiClient.setToken(accessToken);
            set({
              user,
              accessToken,
              refreshToken,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.auth.signup(data);
          
          if (response.data) {
            const { accessToken, refreshToken, user } = response.data;
            
            apiClient.setToken(accessToken);
            set({
              user,
              accessToken,
              refreshToken,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.auth.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          apiClient.clearToken();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            error: null,
          });
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await apiClient.auth.refresh(refreshToken);
          
          if (response.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            apiClient.setToken(accessToken);
            set({
              accessToken,
              refreshToken: newRefreshToken,
            });
          }
        } catch (error) {
          // Refresh failed, logout user
          get().logout();
          throw error;
        }
      },

      setUser: (user) => set({ user }),
      
      setTokens: (accessToken, refreshToken) => {
        apiClient.setToken(accessToken);
        set({ accessToken, refreshToken });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
