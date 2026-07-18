import { create } from 'zustand';

interface ShippingState {
  isSyncing: boolean;
  globalError: string | null;
  setSyncing: (status: boolean) => void;
  setGlobalError: (error: string | null) => void;
}

export const useShippingStore = create<ShippingState>((set) => ({
  isSyncing: false,
  globalError: null,
  setSyncing: (status) => set({ isSyncing: status }),
  setGlobalError: (error) => set({ globalError: error }),
}));
