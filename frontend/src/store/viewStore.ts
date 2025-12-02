import { create } from 'zustand';

interface ViewState {
  viewMode: 'grid' | 'tile';
  setViewMode: (mode: 'grid' | 'tile') => void;
  selectedEmployeeId: number | null;
  setSelectedEmployeeId: (id: number | null) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  viewMode: 'tile',
  setViewMode: (mode) => set({ viewMode: mode }),
  selectedEmployeeId: null,
  setSelectedEmployeeId: (id) => set({ selectedEmployeeId: id }),
}));
