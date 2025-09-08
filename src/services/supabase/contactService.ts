import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { Contact } from '../../types/contacts';

export class SupabaseContactService {
  static async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      const { data: contact, error } = await supabase
        .from('contacts')
        .insert([{
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          job_title: data.jobTitle,
          department: data.department,
          organization: data.organization,
          preferred_contact_method: data.preferredContactMethod,
          timezone: data.timezone,
          type: data.type,
          source: data.source,
          tags: data.tags,
          notes: data.notes,
          custom_fields: data.customFields
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
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch contacts', { error });
        throw error;
      }

      return contacts.map(this.transformContact);
    } catch (error) {
      logger.error('Failed to fetch contacts', { error });
      throw error;
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
      jobTitle: supabaseContact.job_title,
      department: supabaseContact.department,
      organization: supabaseContact.organization,
      preferredContactMethod: supabaseContact.preferred_contact_method || 'email',
      timezone: supabaseContact.timezone,
      type: supabaseContact.type,
      source: supabaseContact.source,
      tags: supabaseContact.tags || [],
      notes: supabaseContact.notes,
      customFields: supabaseContact.custom_fields || {},
      createdAt: new Date(supabaseContact.created_at),
      updatedAt: new Date(supabaseContact.updated_at)
    };
  }
}