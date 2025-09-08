import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { logger } from '../../../utils/monitoring/logger';
import type { Deal } from '../../../types/deals';

const dealsRef = collection(db, 'deals');

export const dealQueries = {
  async getByStage(stage: Deal['stage']) {
    try {
      const q = query(
        dealsRef, 
        where('stage', '==', stage), 
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Deal);
    } catch (error) {
      logger.error('Failed to query deals by stage', { error, stage });
      throw error;
    }
  },

  async getByAssignee(userId: string) {
    try {
      const q = query(
        dealsRef, 
        where('assignedTo', '==', userId), 
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Deal);
    } catch (error) {
      logger.error('Failed to query deals by assignee', { error, userId });
      throw error;
    }
  },

  async getByDateRange(startDate: Date, endDate: Date) {
    try {
      const q = query(
        dealsRef, 
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Deal);
    } catch (error) {
      logger.error('Failed to query deals by date range', { error });
      throw error;
    }
  }
};