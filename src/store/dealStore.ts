import { create } from 'zustand';
import { FirebaseDealService } from '../services/firebase/dealService';
import { logger } from '../utils/monitoring/logger';
import type { Deal } from '../types/deals';

interface DealStore {
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
  fetchDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Deal>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  filterByStage: (stage: Deal['stage']) => Promise<void>;
  filterByAssignee: (userId: string) => Promise<void>;
}

export const useDealStore = create<DealStore>((set) => ({
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
      return newDeal;
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

  filterByStage: async (stage) => {
    set({ isLoading: true, error: null });
    try {
      const q = query(dealsRef, where('stage', '==', stage), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const deals = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
          actualCloseDate: data.actualCloseDate ? new Date(data.actualCloseDate) : undefined
        } as Deal;
      });

      set({ deals, isLoading: false });
    } catch (error) {
      logger.error('Failed to filter deals by stage', { error });
      set({ error: 'Failed to filter deals', isLoading: false });
    }
  },

  filterByAssignee: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const q = query(dealsRef, where('assignedTo', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const deals = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
          actualCloseDate: data.actualCloseDate ? new Date(data.actualCloseDate) : undefined
        } as Deal;
      });
      set({ deals, isLoading: false });
    } catch (error) {
      logger.error('Failed to filter deals by assignee', { error });
      set({ error: 'Failed to filter deals', isLoading: false });
    }
  }
}));