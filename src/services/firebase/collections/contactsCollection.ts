import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Contact } from '../../../types';

const COLLECTION = 'contacts';
const contactsRef = collection(db, COLLECTION);

export const contactsCollection = {
  async create(data: Omit<Contact, 'id'>) {
    const docRef = doc(contactsRef);
    const contact = { ...data, id: docRef.id };
    await setDoc(docRef, contact);
    return contact;
  },

  async get(id: string) {
    const docRef = doc(contactsRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Contact : null;
  },

  async update(id: string, data: Partial<Contact>) {
    const docRef = doc(contactsRef, id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(contactsRef, id);
    await deleteDoc(docRef);
  },

  async getByUserId(userId: string) {
    const q = query(contactsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Contact);
  }
};