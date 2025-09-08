import { create } from 'zustand';
import { SupabaseContactService } from '../services/supabase/contactService';
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
      const contacts = await SupabaseContactService.getContacts();
      set({ contacts, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch contacts', { error });
      set({ error: 'Failed to fetch contacts', isLoading: false });
    }
  },

  addContact: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      const newContact = await SupabaseContactService.createContact(contactData);
      set(state => ({
        contacts: [newContact, ...state.contacts],
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to add contact', { error });
      set({ error: 'Failed to add contact', isLoading: false });
      throw error;
    }
  },

  updateContact: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await SupabaseContactService.updateContact(id, updates);
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
      await SupabaseContactService.deleteContact(id);
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