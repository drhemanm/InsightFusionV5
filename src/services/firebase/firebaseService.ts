import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';

export const db = getFirestore(app);

export class FirebaseService {
  static async create<T extends { id?: string }>(
    collectionName: string,
    data: T
  ): Promise<T> {
    try {
      const docRef = doc(collection(db, collectionName));
      const docData = { ...data, id: docRef.id };
      await setDoc(docRef, docData);
      return docData;
    } catch (error) {
      logger.error(`Failed to create ${collectionName}`, { error });
      throw error;
    }
  }

  static async get<T>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as T : null;
    } catch (error) {
      logger.error(`Failed to get ${collectionName}`, { error });
      throw error;
    }
  }

  static async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
    } catch (error) {
      logger.error(`Failed to update ${collectionName}`, { error });
      throw error;
    }
  }

  static async delete(
    collectionName: string,
    id: string
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      logger.error(`Failed to delete ${collectionName}`, { error });
      throw error;
    }
  }

  static async query<T>(
    collectionName: string,
    conditions: [string, any, any][]
  ): Promise<T[]> {
    try {
      const q = query(
        collection(db, collectionName),
        ...conditions.map(([field, op, value]) => where(field, op, value))
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
    } catch (error) {
      logger.error(`Failed to query ${collectionName}`, { error });
      throw error;
    }
  }
}