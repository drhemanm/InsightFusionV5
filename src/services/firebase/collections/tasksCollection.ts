import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Task } from '../../../types';

const COLLECTION = 'tasks';
const tasksRef = collection(db, COLLECTION);

export const tasksCollection = {
  async create(data: Omit<Task, 'id'>) {
    const docRef = doc(tasksRef);
    const task = { ...data, id: docRef.id };
    await setDoc(docRef, task);
    return task;
  },

  async get(id: string) {
    const docRef = doc(tasksRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Task : null;
  },

  async update(id: string, data: Partial<Task>) {
    const docRef = doc(tasksRef, id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(tasksRef, id);
    await deleteDoc(docRef);
  },

  async getByUserId(userId: string) {
    const q = query(tasksRef, where('assignedTo', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
  }
};