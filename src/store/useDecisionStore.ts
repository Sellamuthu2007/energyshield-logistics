import { create } from 'zustand';

interface DecisionState {
  activeCategory: string | null;
  globalError: string | null;
  setActiveCategory: (category: string | null) => void;
  setGlobalError: (error: string | null) => void;
}

export const useDecisionStore = create<DecisionState>((set) => ({
  activeCategory: null,
  globalError: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
  setGlobalError: (error) => set({ globalError: error }),
}));
