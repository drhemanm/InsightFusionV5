import { supabase, getCurrentCompanyId, getCurrentUser } from '../../config/supabase';
import type { Database } from '../../types/database';
import type { Contact } from '../../types/contacts';

type ContactRow = Database['public']['Tables']['contacts']['Row'];
type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

// Transform database row to Contact type
const transformContact = (row: ContactRow): Contact => {
  return {
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email || '',
    phone: row.phone || '',
    company: row.company_name || '',
    position: row.job_title || '',
    source: row.source || '',
    status: row.status as any,
    tags: row.tags || [],
    notes: row.notes || '',
    lastContact: row.last_contacted_at ? new Date(row.last_contacted_at) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    // Additional fields
    mobile: row.mobile,
    companySize: row.company_size,
    industry: row.industry,
    leadScore: row.lead_score,
    ownerId: row.owner_id,
    address: {
      line1: row.address_line1,
      line2: row.address_line2,
      city: row.city,
      state: row.state,
      country: row.country,
      postalCode: row.postal_code,
    },
    social: {
      linkedin: row.linkedin_url,
      twitter: row.twitter_url,
      website: row.website,
    },
    customFields: row.custom_fields as Record<string, any> || {},
    sentiment: row.sentiment,
    churnRiskScore: row.churn_risk_score,
  };
};

// Transform Contact to database insert
const toContactInsert = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactInsert> => {
  const companyId = await getCurrentCompanyId();
  const currentUser = await getCurrentUser();

  if (!companyId) {
    throw new Error('No company ID found. User must be associated with a company.');
  }

  return {
    company_id: companyId,
    owner_id: contact.ownerId || currentUser?.id,
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    mobile: contact.mobile,
    job_title: contact.position,
    company_name: contact.company,
    company_size: contact.companySize,
    industry: contact.industry,
    source: contact.source,
    status: contact.status as any,
    lead_score: contact.leadScore || 0,
    address_line1: contact.address?.line1,
    address_line2: contact.address?.line2,
    city: contact.address?.city,
    state: contact.address?.state,
    country: contact.address?.country,
    postal_code: contact.address?.postalCode,
    linkedin_url: contact.social?.linkedin,
    twitter_url: contact.social?.twitter,
    website: contact.social?.website,
    tags: contact.tags,
    custom_fields: contact.customFields || {},
    notes: contact.notes,
    last_contacted_at: contact.lastContact?.toISOString(),
    sentiment: contact.sentiment,
    churn_risk_score: contact.churnRiskScore,
  };
};

// Transform Contact partial update
const toContactUpdate = (updates: Partial<Contact>): ContactUpdate => {
  return {
    first_name: updates.firstName,
    last_name: updates.lastName,
    email: updates.email,
    phone: updates.phone,
    mobile: updates.mobile,
    job_title: updates.position,
    company_name: updates.company,
    company_size: updates.companySize,
    industry: updates.industry,
    source: updates.source,
    status: updates.status as any,
    lead_score: updates.leadScore,
    owner_id: updates.ownerId,
    address_line1: updates.address?.line1,
    address_line2: updates.address?.line2,
    city: updates.address?.city,
    state: updates.address?.state,
    country: updates.address?.country,
    postal_code: updates.address?.postalCode,
    linkedin_url: updates.social?.linkedin,
    twitter_url: updates.social?.twitter,
    website: updates.social?.website,
    tags: updates.tags,
    custom_fields: updates.customFields,
    notes: updates.notes,
    last_contacted_at: updates.lastContact?.toISOString(),
    sentiment: updates.sentiment,
    churn_risk_score: updates.churnRiskScore,
  };
};

export class SupabaseContactService {
  /**
   * Get all contacts for the current company
   */
  static async getContacts(): Promise<Contact[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        console.warn('No company ID found, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
        throw new Error(`Failed to fetch contacts: ${error.message}`);
      }

      return (data || []).map(transformContact);
    } catch (error) {
      console.error('Unexpected error in getContacts:', error);
      throw error;
    }
  }

  /**
   * Get a single contact by ID
   */
  static async getContact(id: string): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw new Error(`Failed to fetch contact: ${error.message}`);
      }

      return data ? transformContact(data) : null;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  /**
   * Create a new contact
   */
  static async createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      console.log('📝 Creating contact:', contact);

      const insertData = await toContactInsert(contact);
      console.log('📝 Insert data prepared:', insertData);

      const { data, error } = await supabase
        .from('contacts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to create contact: ${error.message}`);
      }

      if (!data) {
        throw new Error('Contact created but no data returned');
      }

      console.log('✅ Contact created successfully:', data);
      return transformContact(data);
    } catch (error) {
      console.error('❌ Error creating contact:', error);
      throw error;
    }
  }

  /**
   * Update an existing contact
   */
  static async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    try {
      console.log('📝 Updating contact:', id, updates);

      const updateData = toContactUpdate(updates);

      const { data, error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to update contact: ${error.message}`);
      }

      if (!data) {
        throw new Error('Contact updated but no data returned');
      }

      console.log('✅ Contact updated successfully:', data);
      return transformContact(data);
    } catch (error) {
      console.error('❌ Error updating contact:', error);
      throw error;
    }
  }

  /**
   * Delete a contact
   */
  static async deleteContact(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting contact:', id);

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to delete contact: ${error.message}`);
      }

      console.log('✅ Contact deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting contact:', error);
      throw error;
    }
  }

  /**
   * Search contacts by query
   */
  static async searchContacts(query: string): Promise<Contact[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('company_id', companyId)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,company_name.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw new Error(`Failed to search contacts: ${error.message}`);
      }

      return (data || []).map(transformContact);
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }
  }

  /**
   * Get contacts by status
   */
  static async getContactsByStatus(status: string): Promise<Contact[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch contacts by status: ${error.message}`);
      }

      return (data || []).map(transformContact);
    } catch (error) {
      console.error('Error fetching contacts by status:', error);
      throw error;
    }
  }

  /**
   * Get high-value contacts (top lead scores)
   */
  static async getHighValueContacts(limit: number = 10): Promise<Contact[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('company_id', companyId)
        .order('lead_score', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch high-value contacts: ${error.message}`);
      }

      return (data || []).map(transformContact);
    } catch (error) {
      console.error('Error fetching high-value contacts:', error);
      throw error;
    }
  }

  /**
   * Subscribe to contact changes in real-time
   */
  static subscribeToContacts(callback: (contact: Contact) => void) {
    return supabase
      .channel('contacts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
        },
        (payload) => {
          console.log('Contact change detected:', payload);
          if (payload.new) {
            callback(transformContact(payload.new as ContactRow));
          }
        }
      )
      .subscribe();
  }
}

export default SupabaseContactService;
