import { create } from 'zustand';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
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

const campaignsRef = collection(db, 'campaigns');
const campaignTargetsRef = collection(db, 'campaign_targets');

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ isLoading: true });
    try {
      const snapshot = await getDocs(campaignsRef);
      const campaigns = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
      
      set({ campaigns, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch campaigns', { error });
      set({ error: 'Failed to fetch campaigns', isLoading: false });
    }
  },

  createCampaign: async (data) => {
    set({ isLoading: true });
    try {
      const docRef = doc(campaignsRef);
      const campaign: Campaign = {
        ...data,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, campaign);
      
      set(state => ({
        campaigns: [...state.campaigns, campaign],
        isLoading: false
      }));

      return campaign;
    } catch (error) {
      logger.error('Failed to create campaign', { error });
      set({ error: 'Failed to create campaign', isLoading: false });
      throw error;
    }
  },

  updateCampaign: async (id, updates) => {
    set({ isLoading: true });
    try {
      const docRef = doc(campaignsRef, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });

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
      await deleteDoc(doc(campaignsRef, id));
      
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
      const docRef = doc(campaignTargetsRef);
      const campaignTarget: CampaignTarget = {
        ...target,
        id: docRef.id,
        campaignId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, campaignTarget);
    } catch (error) {
      logger.error('Failed to add campaign target', { error });
      throw error;
    }
  },

  updateCampaignTarget: async (campaignId, targetId, updates) => {
    try {
      const docRef = doc(campaignTargetsRef, targetId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      logger.error('Failed to update campaign target', { error });
      throw error;
    }
  },

  removeCampaignTarget: async (campaignId, targetId) => {
    try {
      await deleteDoc(doc(campaignTargetsRef, targetId));
    } catch (error) {
      logger.error('Failed to remove campaign target', { error });
      throw error;
    }
  }
}));