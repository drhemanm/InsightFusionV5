import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';
import type { Deal } from '../../types/deals';

const COLLECTION = 'deals';
const dealsRef = collection(db, COLLECTION);

export class FirebaseDealService {
  static async createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    try {
      const docRef = doc(dealsRef);
      const deal: Deal = {
        ...data,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, {
        ...deal,
        createdAt: deal.createdAt.toISOString(),
        updatedAt: deal.updatedAt.toISOString(),
        expectedCloseDate: deal.expectedCloseDate?.toISOString(),
        actualCloseDate: deal.actualCloseDate?.toISOString()
      });

      logger.info('Deal created successfully', { dealId: deal.id });
      return deal;
    } catch (error) {
      logger.error('Deal creation failed', { error });
      throw error;
    }
  }

  static async getDeals(): Promise<Deal[]> {
    try {
      const q = query(dealsRef, orderBy('createdAt', 'desc'));
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

      return deals;
    } catch (error) {
      logger.error('Failed to fetch deals', { error });
      throw error;
    }
  }

  static async updateDeal(id: string, updates: Partial<Deal>): Promise<void> {
    try {
      const docRef = doc(dealsRef, id);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (updates.expectedCloseDate) {
        updateData.expectedCloseDate = updates.expectedCloseDate.toISOString();
      }
      if (updates.actualCloseDate) {
        updateData.actualCloseDate = updates.actualCloseDate.toISOString();
      }

      await updateDoc(docRef, updateData);
      logger.info('Deal updated successfully', { dealId: id });
    } catch (error) {
      logger.error('Deal update failed', { error, dealId: id });
      throw error;
    }
  }

  static async deleteDeal(id: string): Promise<void> {
    try {
      const docRef = doc(dealsRef, id);
      await deleteDoc(docRef);
      logger.info('Deal deleted successfully', { dealId: id });
    } catch (error) {
      logger.error('Deal deletion failed', { error, dealId: id });
      throw error;
    }
  }
}