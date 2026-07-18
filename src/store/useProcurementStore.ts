import { create } from 'zustand';

interface ProcurementState {
  selectedOrderId: string | null;
  activeFilter: 'all' | 'pending' | 'approved' | 'completed';
  globalError: string | null;
  isSyncing: boolean;
  
  setSelectedOrder: (id: string | null) => void;
  setActiveFilter: (filter: 'all' | 'pending' | 'approved' | 'completed') => void;
  setGlobalError: (error: string | null) => void;
  setSyncing: (isSyncing: boolean) => void;
}

export const useProcurementStore = create<ProcurementState>((set) => ({
  selectedOrderId: null,
  activeFilter: 'all',
  globalError: null,
  isSyncing: false,

  setSelectedOrder: (id) => set({ selectedOrderId: id }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setGlobalError: (error) => set({ globalError: error }),
  setSyncing: (isSyncing) => set({ isSyncing }),
}));
