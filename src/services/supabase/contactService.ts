import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { Contact } from '../../types/contacts';

export class SupabaseContactService {
  static async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      // First check if contacts table exists
      const { error: tableError } = await supabase
        .from('contacts')
        .select('id')
        .limit(1);

      if (tableError) {
        logger.error('Contacts table not accessible', { error: tableError });
        throw new Error('Database not properly configured. Please run migrations first.');
      }

      // Create contact with only basic fields that should exist
      const { data: contact, error } = await supabase
        .from('contacts')
        .insert([{
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone || null,
          organization: data.organization || null,
          notes: data.notes || null
        }])
        .select()
        .single();

      if (error) {
        logger.error('Failed to create contact', { error });
        throw error;
      }

      logger.info('Contact created successfully', { contactId: contact.id });
      return this.transformContact(contact);
    } catch (error) {
      logger.error('Contact creation failed', { error });
      throw error;
    }
  }

  static async getContacts(): Promise<Contact[]> {
    try {
      // Check table access first
      const { error: accessError } = await supabase
        .from('contacts')
        .select('id')
        .limit(1);

      if (accessError) {
        logger.error('Cannot access contacts table', { error: accessError });
        return []; // Return empty array instead of throwing
      }

      const { data: contacts, error } = await supabase
        .from('contacts')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          organization,
          notes,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch contacts', { error });
        return []; // Return empty array instead of throwing
      }

      return (contacts || []).map(this.transformContact);
    } catch (error) {
      logger.error('Failed to fetch contacts', { error });
      return []; // Return empty array instead of throwing
    }
  }

  static async updateContact(id: string, updates: Partial<Contact>): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          email: updates.email,
          phone: updates.phone,
          job_title: updates.jobTitle,
          department: updates.department,
          organization: updates.organization,
          preferred_contact_method: updates.preferredContactMethod,
          timezone: updates.timezone,
          type: updates.type,
          source: updates.source,
          tags: updates.tags,
          notes: updates.notes,
          custom_fields: updates.customFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        logger.error('Failed to update contact', { error, contactId: id });
        throw error;
      }

      logger.info('Contact updated successfully', { contactId: id });
    } catch (error) {
      logger.error('Contact update failed', { error, contactId: id });
      throw error;
    }
  }

  static async deleteContact(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Failed to delete contact', { error, contactId: id });
        throw error;
      }

      logger.info('Contact deleted successfully', { contactId: id });
    } catch (error) {
      logger.error('Contact deletion failed', { error, contactId: id });
      throw error;
    }
  }

  private static transformContact(supabaseContact: any): Contact {
    return {
      id: supabaseContact.id,
      firstName: supabaseContact.first_name,
      lastName: supabaseContact.last_name,
      email: supabaseContact.email,
      phone: supabaseContact.phone,
      jobTitle: supabaseContact.job_title || '',
      department: supabaseContact.department || '',
      organization: supabaseContact.organization || '',
      preferredContactMethod: 'email' as const,
      timezone: supabaseContact.timezone || 'UTC',
      type: 'lead' as const,
      source: supabaseContact.source || '',
      tags: supabaseContact.tags || [],
      notes: supabaseContact.notes || '',
      customFields: supabaseContact.custom_fields || {},
      createdAt: new Date(supabaseContact.created_at),
      updatedAt: new Date(supabaseContact.updated_at)
    };
  }
}