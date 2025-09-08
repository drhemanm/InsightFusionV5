```typescript
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { ContactSchema } from '../../types/contacts';
import { contactScoringService } from './ContactScoringService';
import { duplicateDetectionService } from './DuplicateDetectionService';
import { logger } from '../../utils/monitoring/logger';
import type { Contact } from '../../types/contacts';

const COLLECTION = 'contacts';
const contactsRef = collection(db, COLLECTION);

class ContactService {
  private static instance: ContactService;

  private constructor() {}

  static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      // Validate data
      const validatedData = await ContactSchema.parseAsync(data);

      // Check for duplicates
      const duplicates = await duplicateDetectionService.findDuplicates(
        validatedData as Contact,
        await this.getAllContacts()
      );

      if (duplicates.length > 0) {
        logger.warn('Potential duplicates found', { 
          duplicateCount: duplicates.length,
          email: data.email 
        });
      }

      // Create contact
      const docRef = doc(contactsRef);
      const contact = {
        ...validatedData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, contact);

      // Calculate initial score
      const score = await contactScoringService.calculateScore(contact);
      await this.updateContact(contact.id, { score });

      logger.info('Contact created successfully', { contactId: contact.id });
      return contact;
    } catch (error) {
      logger.error('Failed to create contact', { error });
      throw error;
    }
  }

  async getContact(id: string): Promise<Contact | null> {
    try {
      const docRef = doc(contactsRef, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as Contact : null;
    } catch (error) {
      logger.error('Failed to get contact', { error, contactId: id });
      throw error;
    }
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<void> {
    try {
      const docRef = doc(contactsRef, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      logger.info('Contact updated successfully', { contactId: id });
    } catch (error) {
      logger.error('Failed to update contact', { error, contactId: id });
      throw error;
    }
  }

  async deleteContact(id: string): Promise<void> {
    try {
      const docRef = doc(contactsRef, id);
      await deleteDoc(docRef);
      logger.info('Contact deleted successfully', { contactId: id });
    } catch (error) {
      logger.error('Failed to delete contact', { error, contactId: id });
      throw error;
    }
  }

  private async getAllContacts(): Promise<Contact[]> {
    const snapshot = await getDocs(contactsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Contact);
  }

  async searchContacts(searchTerm: string): Promise<Contact[]> {
    try {
      // Search in firstName, lastName, and email fields
      const q = query(
        contactsRef,
        where('searchableText', '>=', searchTerm.toLowerCase()),
        where('searchableText', '<=', searchTerm.toLowerCase() + '\uf8ff')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Contact);
    } catch (error) {
      logger.error('Failed to search contacts', { error, searchTerm });
      throw error;
    }
  }
}

export const contactService = ContactService.getInstance();
```