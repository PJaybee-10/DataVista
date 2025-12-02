import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '../types';
import { TOKEN_KEY } from '../config/constants';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem(TOKEN_KEY);
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: TOKEN_KEY,
      // Only persist token and user, not the entire state
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
