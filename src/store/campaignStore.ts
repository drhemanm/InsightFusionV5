import { create } from 'zustand';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Campaign } from '../types/campaigns';

interface CampaignState {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
}

// Mock Firebase Campaign Service
class FirebaseCampaignService {
  static async getCampaigns(): Promise<Campaign[]> {
    try {
      const campaignsRef = collection(db, 'campaigns');
      const q = query(campaignsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  static async createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'campaigns'), {
        ...campaignData,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<void> {
    try {
      const campaignRef = doc(db, 'campaigns', id);
      await updateDoc(campaignRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  static async deleteCampaign(id: string): Promise<void> {
    try {
      const campaignRef = doc(db, 'campaigns', id);
      await deleteDoc(campaignRef);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  isLoading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const campaigns = await FirebaseCampaignService.getCampaigns();
      set({ campaigns, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch campaigns',
        isLoading: false 
      });
    }
  },

  createCampaign: async (campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const id = await FirebaseCampaignService.createCampaign(campaignData);
      const newCampaign: Campaign = {
        id,
        ...campaignData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      set(state => ({
        campaigns: [newCampaign, ...state.campaigns],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create campaign',
        isLoading: false 
      });
    }
  },

  updateCampaign: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await FirebaseCampaignService.updateCampaign(id, updates);
      
      set(state => ({
        campaigns: state.campaigns.map(campaign =>
          campaign.id === id 
            ? { ...campaign, ...updates, updatedAt: new Date().toISOString() }
            : campaign
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update campaign',
        isLoading: false 
      });
    }
  },

  deleteCampaign: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await FirebaseCampaignService.deleteCampaign(id);
      
      set(state => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete campaign',
        isLoading: false 
      });
    }
  }
}));