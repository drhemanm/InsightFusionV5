import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { Contact } from '../../types/contacts';

export class SupabaseContactService {
  static async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      console.log('🔄 Creating contact with data:', data);
      
      // Create contact with only the essential fields that exist in the table
      const { data: contact, error } = await supabase
        .from('contacts')
        .insert([{
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          job_title: data.jobTitle,
          department: data.department,
          organization: data.organization
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        logger.error('Failed to create contact', { error, data });
        throw error;
      }

      console.log('✅ Contact created in Supabase:', contact);
      logger.info('Contact created successfully', { contactId: contact.id });
      return this.transformContact(contact);
    } catch (error) {
      console.error('❌ Contact creation exception:', error);
      logger.error('Contact creation failed', { error });
      throw error;
    }
  }

  static async getContacts(): Promise<Contact[]> {
    try {
      console.log('🔄 Fetching contacts from Supabase...');

      // Try to fetch contacts with minimal fields first
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase fetch error:', error);
        logger.error('Failed to fetch contacts', { error });
        
        // If it's a table not found error, return empty array
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('📋 Contacts table does not exist, returning empty array');
          return [];
        }
        
        throw error;
      }

      console.log('✅ Fetched contacts from Supabase:', contacts?.length || 0);
      return (contacts || []).map(this.transformContact);
    } catch (error) {
      console.error('❌ Fetch contacts exception:', error);
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
    console.log('🔄 Transforming contact:', supabaseContact);
    
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