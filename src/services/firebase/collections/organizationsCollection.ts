import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Organization } from '../../../types/organization';

const COLLECTION = 'organizations';
const organizationsRef = collection(db, COLLECTION);

export const organizationsCollection = {
  async create(data: Omit<Organization, 'id'>) {
    const docRef = doc(organizationsRef);
    const organization = { ...data, id: docRef.id };
    await setDoc(docRef, organization);
    return organization;
  },

  async get(id: string) {
    const docRef = doc(organizationsRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Organization : null;
  },

  async update(id: string, data: Partial<Organization>) {
    const docRef = doc(organizationsRef, id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(organizationsRef, id);
    await deleteDoc(docRef);
  },

  async getAll() {
    const querySnapshot = await getDocs(organizationsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Organization);
  }
};