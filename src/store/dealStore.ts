import { create } from 'zustand';
import { Deal } from '../types/deals';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

interface DealState {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  fetchDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  getDealsByStage: (stage: string) => Deal[];
  getDealsByAgent: (agentId: string) => Deal[];
}

export const useDealStore = create<DealState>((set, get) => ({
  deals: [],
  loading: false,
  error: null,

  fetchDeals: async () => {
    set({ loading: true, error: null });
    try {
      const dealsCollection = collection(db, 'deals');
      const q = query(dealsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const deals: Deal[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Deal[];
      
      set({ deals, loading: false });
    } catch (error) {
      console.error('Error fetching deals:', error);
      set({ error: 'Failed to fetch deals', loading: false });
    }
  },

  addDeal: async (dealData) => {
    set({ loading: true, error: null });
    try {
      const dealsCollection = collection(db, 'deals');
      const now = new Date();
      
      const newDeal = {
        ...dealData,
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await addDoc(dealsCollection, newDeal);
      
      const deal: Deal = {
        id: docRef.id,
        ...newDeal,
      };
      
      set(state => ({
        deals: [deal, ...state.deals],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding deal:', error);
      set({ error: 'Failed to add deal', loading: false });
    }
  },

  updateDeal: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const dealDoc = doc(db, 'deals', id);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await updateDoc(dealDoc, updateData);
      
      set(state => ({
        deals: state.deals.map(deal =>
          deal.id === id ? { ...deal, ...updateData } : deal
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating deal:', error);
      set({ error: 'Failed to update deal', loading: false });
    }
  },

  deleteDeal: async (id) => {
    set({ loading: true, error: null });
    try {
      const dealDoc = doc(db, 'deals', id);
      await deleteDoc(dealDoc);
      
      set(state => ({
        deals: state.deals.filter(deal => deal.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting deal:', error);
      set({ error: 'Failed to delete deal', loading: false });
    }
  },

  getDealsByStage: (stage) => {
    return get().deals.filter(deal => deal.stage === stage);
  },

  getDealsByAgent: (agentId) => {
    return get().deals.filter(deal => deal.assignedTo === agentId);
  },
}));