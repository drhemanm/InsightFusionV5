import { create } from 'zustand';
import { SupabaseContactService } from '../services/supabase/contactService';
import type { Contact } from '../types/contacts';

interface ContactStore {
  contacts: Contact[];
  selectedContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  setSelectedContact: (contact: Contact | null) => void;
  searchContacts: (query: string) => Promise<void>;
  getContactsByStatus: (status: string) => Promise<void>;
  clearError: () => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  selectedContact: null,
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching contacts...');
      const contacts = await SupabaseContactService.getContacts();
      console.log(`✅ Fetched ${contacts.length} contacts`);
      set({ contacts, isLoading: false });
    } catch (error) {
      console.error('❌ Failed to fetch contacts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addContact: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Adding contact:', contactData);
      const newContact = await SupabaseContactService.createContact(contactData);
      console.log('✅ Contact added successfully:', newContact);
      
      set(state => ({
        contacts: [newContact, ...state.contacts],
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Failed to add contact:', error);
      
      let errorMessage = 'Failed to add contact';
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please check your database permissions or contact your administrator.';
        } else if (error.message.includes('duplicate')) {
          errorMessage = 'A contact with this email already exists.';
        } else if (error.message.includes('company')) {
          errorMessage = 'No company associated with your account. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateContact: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Updating contact:', id, updates);
      const updatedContact = await SupabaseContactService.updateContact(id, updates);
      console.log('✅ Contact updated successfully:', updatedContact);
      
      set(state => ({
        contacts: state.contacts.map(contact =>
          contact.id === id ? updatedContact : contact
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Failed to update contact:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update contact';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Deleting contact:', id);
      await SupabaseContactService.deleteContact(id);
      console.log('✅ Contact deleted successfully');
      
      set(state => ({
        contacts: state.contacts.filter(contact => contact.id !== id),
        selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Failed to delete contact:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedContact: (contact) => {
    set({ selectedContact: contact });
  },

  searchContacts: async (query) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Searching contacts:', query);
      const contacts = await SupabaseContactService.searchContacts(query);
      console.log(`✅ Found ${contacts.length} matching contacts`);
      set({ contacts, isLoading: false });
    } catch (error) {
      console.error('❌ Failed to search contacts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to search contacts';
      set({ error: errorMessage, isLoading: false });
    }
  },

  getContactsByStatus: async (status) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching contacts by status:', status);
      const contacts = await SupabaseContactService.getContactsByStatus(status);
      console.log(`✅ Found ${contacts.length} contacts with status: ${status}`);
      set({ contacts, isLoading: false });
    } catch (error) {
      console.error('❌ Failed to fetch contacts by status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
