import { create } from 'zustand';

interface RefineryState {
  isSyncing: boolean;
  globalError: string | null;
  setSyncing: (status: boolean) => void;
  setGlobalError: (error: string | null) => void;
}

export const useRefineryStore = create<RefineryState>((set) => ({
  isSyncing: false,
  globalError: null,
  setSyncing: (status) => set({ isSyncing: status }),
  setGlobalError: (error) => set({ globalError: error }),
}));
