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
import type { Contact } from '../../types/contacts';

const COLLECTION = 'contacts';
const contactsRef = collection(db, COLLECTION);

export class FirebaseContactService {
  static async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      console.log('🔄 Creating contact with Firebase:', data);
      
      const docRef = doc(contactsRef);
      const contact: Contact = {
        ...data,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, {
        ...contact,
        createdAt: contact.createdAt.toISOString(),
        updatedAt: contact.updatedAt.toISOString()
      });

      console.log('✅ Contact created in Firebase:', contact.id);
      logger.info('Contact created successfully', { contactId: contact.id });
      return contact;
    } catch (error) {
      console.error('❌ Firebase contact creation failed:', error);
      logger.error('Contact creation failed', { error });
      throw error;
    }
  }

  static async getContacts(): Promise<Contact[]> {
    try {
      console.log('🔄 Fetching contacts from Firebase...');

      const q = query(contactsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const contacts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        } as Contact;
      });

      console.log('✅ Fetched contacts from Firebase:', contacts.length);
      return contacts;
    } catch (error) {
      console.error('❌ Firebase fetch contacts failed:', error);
      logger.error('Failed to fetch contacts', { error });
      return [];
    }
  }

  static async updateContact(id: string, updates: Partial<Contact>): Promise<void> {
    try {
      const docRef = doc(contactsRef, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      logger.info('Contact updated successfully', { contactId: id });
    } catch (error) {
      logger.error('Contact update failed', { error, contactId: id });
      throw error;
    }
  }

  static async deleteContact(id: string): Promise<void> {
    try {
      const docRef = doc(contactsRef, id);
      await deleteDoc(docRef);

      logger.info('Contact deleted successfully', { contactId: id });
    } catch (error) {
      logger.error('Contact deletion failed', { error, contactId: id });
      throw error;
    }
  }

  static async getContactById(id: string): Promise<Contact | null> {
    try {
      const docRef = doc(contactsRef, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        } as Contact;
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to get contact', { error, contactId: id });
      throw error;
    }
  }
}