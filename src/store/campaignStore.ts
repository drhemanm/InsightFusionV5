import { create } from 'zustand';
import { supabase } from '../config/supabase';
import { logger } from '../utils/monitoring/logger';
import type { Campaign, CampaignTarget } from '../types/campaigns';

interface CampaignStore {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCampaigns: () => Promise<void>;
  createCampaign: (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Campaign>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  addCampaignTarget: (campaignId: string, target: Omit<CampaignTarget, 'id' | 'campaignId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCampaignTarget: (campaignId: string, targetId: string, updates: Partial<CampaignTarget>) => Promise<void>;
  removeCampaignTarget: (campaignId: string, targetId: string) => Promise<void>;
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ isLoading: true });
    try {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set({ campaigns: campaigns || [], isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch campaigns', { error });
      set({ error: 'Failed to fetch campaigns', isLoading: false });
    }
  },

  createCampaign: async (data) => {
    set({ isLoading: true });
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert([{
          name: data.name,
          type: data.type,
          description: data.description,
          budget: data.budget,
          start_date: data.startDate.toISOString(),
          end_date: data.endDate.toISOString(),
          status: data.status,
          created_by: data.createdBy,
          manager_id: data.managerId,
          kpis: data.kpis,
          metrics: data.metrics
        }])
        .select()
        .single();

      if (error) throw error;

      const newCampaign: Campaign = {
        ...data,
        id: campaign.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set(state => ({
        campaigns: [...state.campaigns, newCampaign],
        isLoading: false
      }));

      return newCampaign;
    } catch (error) {
      logger.error('Failed to create campaign', { error });
      set({ error: 'Failed to create campaign', isLoading: false });
      throw error;
    }
  },

  updateCampaign: async (id, updates) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          name: updates.name,
          type: updates.type,
          description: updates.description,
          budget: updates.budget,
          start_date: updates.startDate?.toISOString(),
          end_date: updates.endDate?.toISOString(),
          status: updates.status,
          manager_id: updates.managerId,
          kpis: updates.kpis,
          metrics: updates.metrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        campaigns: state.campaigns.map(campaign =>
          campaign.id === id
            ? { ...campaign, ...updates, updatedAt: new Date() }
            : campaign
        ),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to update campaign', { error });
      set({ error: 'Failed to update campaign', isLoading: false });
      throw error;
    }
  },

  deleteCampaign: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== id),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to delete campaign', { error });
      set({ error: 'Failed to delete campaign', isLoading: false });
      throw error;
    }
  },

  addCampaignTarget: async (campaignId, target) => {
    try {
      const { error } = await supabase
        .from('campaign_targets')
        .insert([{
          campaign_id: campaignId,
          target_type: target.targetType,
          target_id: target.targetId,
          status: target.status,
          notes: target.notes
        }]);

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to add campaign target', { error });
      throw error;
    }
  },

  updateCampaignTarget: async (campaignId, targetId, updates) => {
    try {
      const { error } = await supabase
        .from('campaign_targets')
        .update({
          status: updates.status,
          notes: updates.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetId);

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to update campaign target', { error });
      throw error;
    }
  },

  removeCampaignTarget: async (campaignId, targetId) => {
    try {
      const { error } = await supabase
        .from('campaign_targets')
        .delete()
        .eq('id', targetId);

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to remove campaign target', { error });
      throw error;
    }
  }
}));