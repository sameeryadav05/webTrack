import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          if (response.data.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
          return { success: false, message: 'Login failed' };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'An error occurred during login',
            isLoading: false,
          });
          return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', { name, email, password });
          if (response.data.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
          return { success: false, message: 'Registration failed' };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'An error occurred during registration',
            isLoading: false,
          });
          return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // unique name
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export default useAuthStore;
