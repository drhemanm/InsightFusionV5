import { create } from 'zustand';
import { FirebaseContactService } from '../services/firebase/contactService';
import { logger } from '../utils/monitoring/logger';
import type { Contact } from '../types/contacts';

interface ContactStore {
  contacts: Contact[];
  selectedContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  setSelectedContact: (contact: Contact | null) => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  selectedContact: null,
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const contacts = await FirebaseContactService.getContacts();
      set({ contacts, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch contacts', { error });
      set({ error: 'Failed to fetch contacts', isLoading: false });
    }
  },

  addContact: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Adding contact via store:', contactData);
      const newContact = await FirebaseContactService.createContact(contactData);
      console.log('✅ Contact added successfully:', newContact);
      set(state => ({
        contacts: [newContact, ...state.contacts],
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Store: Failed to add contact:', error);
      logger.error('Failed to add contact', { error });
      
      // Provide more specific error messages
      let errorMessage = 'Failed to add contact';
      if (error instanceof Error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          errorMessage = 'Database table not found. Please check your database setup.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please check your database permissions.';
        } else if (error.message.includes('duplicate')) {
          errorMessage = 'A contact with this email already exists.';
        } else {
          errorMessage = `Database error: ${error.message}`;
        }
      }
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateContact: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await FirebaseContactService.updateContact(id, updates);
      set(state => ({
        contacts: state.contacts.map(contact =>
          contact.id === id ? { ...contact, ...updates } : contact
        ),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to update contact', { error });
      set({ error: 'Failed to update contact', isLoading: false });
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await FirebaseContactService.deleteContact(id);
      set(state => ({
        contacts: state.contacts.filter(contact => contact.id !== id),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to delete contact', { error });
      set({ error: 'Failed to delete contact', isLoading: false });
      throw error;
    }
  },

  setSelectedContact: (contact) => set({ selectedContact: contact }),
}));