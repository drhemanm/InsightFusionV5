import { create } from 'zustand';
import { supabase, getCurrentCompanyId } from '../config/supabase';
import type { Database } from '../types/database';

type CampaignRow = Database['public']['Tables']['campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'whatsapp' | 'social' | null;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  targetAudience: any;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CampaignStore {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCampaigns: () => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'totalSent' | 'totalDelivered' | 'totalOpened' | 'totalClicked' | 'totalConverted'>) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  clearError: () => void;
}

// Transform database row to Campaign
const transformCampaign = (row: CampaignRow): Campaign => {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    type: row.type,
    status: row.status,
    targetAudience: row.target_audience,
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : undefined,
    startedAt: row.started_at ? new Date(row.started_at) : undefined,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    totalSent: row.total_sent,
    totalDelivered: row.total_delivered,
    totalOpened: row.total_opened,
    totalClicked: row.total_clicked,
    totalConverted: row.total_converted,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
};

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        console.warn('No company ID found, returning empty array');
        set({ campaigns: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch campaigns: ${error.message}`);
      }

      const campaigns = (data || []).map(transformCampaign);
      set({ campaigns, isLoading: false });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch campaigns';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addCampaign: async (campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        throw new Error('No company ID found');
      }

      const insertData: CampaignInsert = {
        company_id: companyId,
        name: campaignData.name,
        description: campaignData.description,
        type: campaignData.type,
        status: campaignData.status,
        target_audience: campaignData.targetAudience || {},
        scheduled_at: campaignData.scheduledAt?.toISOString(),
        started_at: campaignData.startedAt?.toISOString(),
        completed_at: campaignData.completedAt?.toISOString(),
      };

      const { data, error } = await supabase
        .from('campaigns')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create campaign: ${error.message}`);
      }

      if (!data) {
        throw new Error('Campaign created but no data returned');
      }

      const newCampaign = transformCampaign(data);
      
      set(state => ({
        campaigns: [newCampaign, ...state.campaigns],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error creating campaign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create campaign';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateCampaign: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updateData: CampaignUpdate = {
        name: updates.name,
        description: updates.description,
        type: updates.type,
        status: updates.status,
        target_audience: updates.targetAudience,
        scheduled_at: updates.scheduledAt?.toISOString(),
        started_at: updates.startedAt?.toISOString(),
        completed_at: updates.completedAt?.toISOString(),
        total_sent: updates.totalSent,
        total_delivered: updates.totalDelivered,
        total_opened: updates.totalOpened,
        total_clicked: updates.totalClicked,
        total_converted: updates.totalConverted,
      };

      const { data, error } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update campaign: ${error.message}`);
      }

      if (!data) {
        throw new Error('Campaign updated but no data returned');
      }

      const updatedCampaign = transformCampaign(data);
      
      set(state => ({
        campaigns: state.campaigns.map(campaign =>
          campaign.id === id ? updatedCampaign : campaign
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating campaign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update campaign';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteCampaign: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete campaign: ${error.message}`);
      }

      set(state => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== id),
        selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting campaign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete campaign';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedCampaign: (campaign) => {
    set({ selectedCampaign: campaign });
  },

  clearError: () => {
    set({ error: null });
  },
}));
