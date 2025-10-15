import { create } from 'zustand';
import { SupabaseDealService } from '../services/supabase/dealService';
import type { Deal } from '../types/deals';

interface DealStore {
  deals: Deal[];
  selectedDeal: Deal | null;
  isLoading: boolean;
  error: string | null;
  pipelineStats: {
    totalValue: number;
    dealCount: number;
    wonDeals: number;
    lostDeals: number;
    activeDeals: number;
    avgDealValue: number;
    stageDistribution: Record<string, number>;
  } | null;
  
  // Actions
  fetchDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  setSelectedDeal: (deal: Deal | null) => void;
  getDealsByStage: (stage: string) => Promise<void>;
  getDealsByContact: (contactId: string) => Promise<void>;
  fetchPipelineStats: () => Promise<void>;
  getDealsClosingSoon: (withinDays?: number) => Promise<Deal[]>;
  clearError: () => void;
}

export const useDealStore = create<DealStore>((set, get) => ({
  deals: [],
  selectedDeal: null,
  isLoading: false,
  error: null,
  pipelineStats: null,

  fetchDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching deals...');
      const deals = await SupabaseDealService.getDeals();
      console.log(`✅ Fetched ${deals.length} deals`);
      set({ deals, isLoading: false });
    } catch (error) {
      console.error('❌ Failed to fetch deals:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch deals';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addDeal: async (dealData) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Adding deal:', dealData);
      const newDeal = await SupabaseDealService.createDeal(dealData);
      console.log('✅ Deal added successfully:', newDeal);
      
      set(state => ({
        deals: [newDeal, ...state.deals],
        isLoading: false
      }));

      // Refresh pipeline stats
      get().fetchPipelineStats();
    } catch (error) {
      console.error('❌ Failed to add deal:', error);
      
      let errorMessage = 'Failed to add deal';
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please check your database permissions or contact your administrator.';
        } else if (error.message.includes('company')) {
          errorMessage = 'No company associated with your account. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateDeal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Updating deal:', id, updates);
      const updatedDeal = await SupabaseDealService.updateDeal(id, updates);
      console.log('✅ Deal updated successfully:', updatedDeal);
      
      set(state => ({
        deals: state.deals.map(deal =>
          deal.id === id ? updatedDeal : deal
        ),
        isLoading: false
      }));

      // Refresh pipeline stats
      get().fetchPipelineStats();
    } catch (error) {
      console.error('❌ Failed to update deal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update deal';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteDeal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Deleting deal:', id);
      await SupabaseDealService.deleteDeal(id);
      console.log('✅ Deal deleted successfully');
      
      set(state => ({
        deals: state.deals.filter(deal => deal.id !== id),
        selectedDeal: state.selectedDeal?.id === id ? null : state.selectedDeal,
        isLoading: false
      }));

      // Refresh pipeline stats
      get().fetchPipelineStats();
    } catch (error) {
      console.error('❌ Failed to delete deal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete deal';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedDeal: (deal) => {
    set({ selectedDeal: deal });
  },

  getDealsByStage: async (stage) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching deals by stage:', stage);
      const deals = await SupabaseDealService.getDealsByStage(stage);
      console.log(`✅ Found ${deals.length} deals in stage: ${stage}`);
      set({ deals, isLoading: false });
    } catch (error) {
      console.error('❌ Failed to fetch deals by stage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch deals';
      set({ error: errorMessage, isLoading: false });
    }
  },

  getDealsByContact: async (contactId) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching deals by contact:', contactId);
      const deals = await SupabaseDealService.getDealsByContact(contactId);
      console.log(`✅ Found ${deals.length} deals for contact`);
      set({ deals, isLoading: false });
    } catch (error) {
      console.error('❌ Failed to fetch deals by contact:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch deals';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPipelineStats: async () => {
    try {
      console.log('🔄 Fetching pipeline statistics...');
      const stats = await SupabaseDealService.getPipelineStats();
      console.log('✅ Pipeline stats fetched:', stats);
      set({ pipelineStats: stats });
    } catch (error) {
      console.error('❌ Failed to fetch pipeline stats:', error);
      // Don't set error state for stats, just log it
    }
  },

  getDealsClosingSoon: async (withinDays = 7) => {
    try {
      console.log(`🔄 Fetching deals closing within ${withinDays} days...`);
      const deals = await SupabaseDealService.getDealsClosingSoon(withinDays);
      console.log(`✅ Found ${deals.length} deals closing soon`);
      return deals;
    } catch (error) {
      console.error('❌ Failed to fetch deals closing soon:', error);
      return [];
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
