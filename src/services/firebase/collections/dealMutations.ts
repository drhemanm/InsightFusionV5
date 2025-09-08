import { collection, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DealSchema } from '../../../types/deals';
import { logger } from '../../../utils/monitoring/logger';
import type { Deal } from '../../../types/deals';

const COLLECTION = 'deals';
const dealsRef = collection(db, COLLECTION);

export const dealMutations = {
  async create(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Validate data against schema
      const validatedData = await DealSchema.parseAsync(data);

      const docRef = doc(dealsRef);
      const deal = {
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...validatedData,
        value: Number(validatedData.value),
        expectedCloseDate: validatedData.expectedCloseDate ? new Date(validatedData.expectedCloseDate).toISOString() : null,
        actualCloseDate: null
      };
      
      await setDoc(docRef, deal);
      
      logger.info('Deal created successfully', { 
        dealId: deal.id,
        title: deal.title,
        value: deal.value
      });
      
      return {
        ...deal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
    } catch (error) {
      logger.error('Failed to create deal', { 
        error,
        data: {
          title: data.title,
          value: data.value,
          stage: data.stage
        }
      });
      throw new Error(error instanceof Error ? error.message : 'Failed to create deal');
    }
  },

  async update(id: string, updates: Partial<Deal>) {
    try {
      const docRef = doc(dealsRef, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        value: updates.value ? Number(updates.value) : undefined,
        expectedCloseDate: updates.expectedCloseDate?.toISOString(),
        actualCloseDate: updates.actualCloseDate?.toISOString()
      });
    } catch (error) {
      logger.error('Failed to update deal', { error, dealId: id });
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const docRef = doc(dealsRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      logger.error('Failed to delete deal', { error, dealId: id });
      throw error;
    }
  }
};