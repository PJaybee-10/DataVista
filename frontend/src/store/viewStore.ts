import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewStore } from '../types';

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      viewMode: 'tile',
      setViewMode: (mode: 'grid' | 'tile') => {
        set({ viewMode: mode });
      },
      selectedEmployeeId: null,
      setSelectedEmployeeId: (id: number | null) => {
        set({ selectedEmployeeId: id });
      },
    }),
    {
      name: 'view-storage',
      // Only persist viewMode, not selectedEmployeeId
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
);
