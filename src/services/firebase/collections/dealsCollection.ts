import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Deal } from '../../../types';

const COLLECTION = 'deals';
const dealsRef = collection(db, COLLECTION);

export const dealsCollection = {
  async create(data: Omit<Deal, 'id'>) {
    const docRef = doc(dealsRef);
    const deal = { ...data, id: docRef.id };
    await setDoc(docRef, deal);
    return deal;
  },

  async get(id: string) {
    const docRef = doc(dealsRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Deal : null;
  },

  async update(id: string, data: Partial<Deal>) {
    const docRef = doc(dealsRef, id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(dealsRef, id);
    await deleteDoc(docRef);
  },

  async getByUserId(userId: string) {
    const q = query(dealsRef, where('assignedTo', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Deal);
  }
};