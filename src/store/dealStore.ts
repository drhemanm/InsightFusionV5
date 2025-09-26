import { create } from 'zustand';
import { FirebaseDealService } from '../services/firebase/dealService';
import { logger } from '../utils/monitoring/logger';
import type { Deal } from '../types/deals';

interface DealStore {
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
  fetchDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  getDealsByStage: (stage: string) => Deal[];
  getDealsByAgent: (agentId: string) => Deal[];
}

export const useDealStore = create<DealStore>((set, get) => ({
  deals: [],
  isLoading: false,
  error: null,

  fetchDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      const deals = await FirebaseDealService.getDeals();
      set({ deals, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch deals', { error });
      set({ error: 'Failed to fetch deals', isLoading: false });
    }
  },

  addDeal: async (dealData) => {
    set({ isLoading: true, error: null });
    try {
      const newDeal = await FirebaseDealService.createDeal(dealData);
      set(state => ({
        deals: [newDeal, ...state.deals],
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to add deal', { error });
      set({ error: 'Failed to add deal', isLoading: false });
      throw error;
    }
  },

  updateDeal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await FirebaseDealService.updateDeal(id, updates);
      set(state => ({
        deals: state.deals.map(deal =>
          deal.id === id ? { ...deal, ...updates } : deal
        ),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to update deal', { error });
      set({ error: 'Failed to update deal', isLoading: false });
      throw error;
    }
  },

  deleteDeal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await FirebaseDealService.deleteDeal(id);
      set(state => ({
        deals: state.deals.filter(deal => deal.id !== id),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to delete deal', { error });
      set({ error: 'Failed to delete deal', isLoading: false });
      throw error;
    }
  },

  getDealsByStage: (stage) => {
    return get().deals.filter(deal => deal.stage === stage);
  },

  getDealsByAgent: (agentId) => {
    return get().deals.filter(deal => deal.assignedTo === agentId);
  },
}));