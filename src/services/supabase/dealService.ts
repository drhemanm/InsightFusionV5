import { supabase, getCurrentCompanyId, getCurrentUser } from '../../config/supabase';
import type { Database } from '../../types/database';
import type { Deal } from '../../types/deals';

type DealRow = Database['public']['Tables']['deals']['Row'];
type DealInsert = Database['public']['Tables']['deals']['Insert'];
type DealUpdate = Database['public']['Tables']['deals']['Update'];

// Transform database row to Deal type
const transformDeal = (row: DealRow): Deal => {
  return {
    id: row.id,
    title: row.title,
    value: Number(row.value),
    stage: row.stage as any,
    contactId: row.contact_id || undefined,
    ownerId: row.owner_id || undefined,
    expectedCloseDate: row.expected_close_date ? new Date(row.expected_close_date) : undefined,
    probability: row.probability,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    // Additional fields
    description: row.description || '',
    currency: row.currency,
    actualCloseDate: row.actual_close_date ? new Date(row.actual_close_date) : undefined,
    lostReason: row.lost_reason,
    winReason: row.win_reason,
    tags: row.tags || [],
    customFields: row.custom_fields as Record<string, any> || {},
  };
};

// Transform Deal to database insert
const toDealInsert = async (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<DealInsert> => {
  const companyId = await getCurrentCompanyId();
  const currentUser = await getCurrentUser();

  if (!companyId) {
    throw new Error('No company ID found. User must be associated with a company.');
  }

  return {
    company_id: companyId,
    contact_id: deal.contactId,
    owner_id: deal.ownerId || currentUser?.id,
    title: deal.title,
    description: deal.description,
    value: deal.value,
    currency: deal.currency || 'USD',
    stage: deal.stage as any,
    probability: deal.probability || 0,
    expected_close_date: deal.expectedCloseDate?.toISOString().split('T')[0],
    actual_close_date: deal.actualCloseDate?.toISOString().split('T')[0],
    lost_reason: deal.lostReason,
    win_reason: deal.winReason,
    tags: deal.tags,
    custom_fields: deal.customFields || {},
  };
};

// Transform Deal partial update
const toDealUpdate = (updates: Partial<Deal>): DealUpdate => {
  return {
    title: updates.title,
    description: updates.description,
    value: updates.value,
    currency: updates.currency,
    stage: updates.stage as any,
    probability: updates.probability,
    contact_id: updates.contactId,
    owner_id: updates.ownerId,
    expected_close_date: updates.expectedCloseDate?.toISOString().split('T')[0],
    actual_close_date: updates.actualCloseDate?.toISOString().split('T')[0],
    lost_reason: updates.lostReason,
    win_reason: updates.winReason,
    tags: updates.tags,
    custom_fields: updates.customFields,
  };
};

export class SupabaseDealService {
  /**
   * Get all deals for the current company
   */
  static async getDeals(): Promise<Deal[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        console.warn('No company ID found, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deals:', error);
        throw new Error(`Failed to fetch deals: ${error.message}`);
      }

      return (data || []).map(transformDeal);
    } catch (error) {
      console.error('Unexpected error in getDeals:', error);
      throw error;
    }
  }

  /**
   * Get a single deal by ID
   */
  static async getDeal(id: string): Promise<Deal | null> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to fetch deal: ${error.message}`);
      }

      return data ? transformDeal(data) : null;
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw error;
    }
  }

  /**
   * Create a new deal
   */
  static async createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    try {
      console.log('📝 Creating deal:', deal);

      const insertData = await toDealInsert(deal);
      console.log('📝 Insert data prepared:', insertData);

      const { data, error } = await supabase
        .from('deals')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to create deal: ${error.message}`);
      }

      if (!data) {
        throw new Error('Deal created but no data returned');
      }

      console.log('✅ Deal created successfully:', data);
      return transformDeal(data);
    } catch (error) {
      console.error('❌ Error creating deal:', error);
      throw error;
    }
  }

  /**
   * Update an existing deal
   */
  static async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    try {
      console.log('📝 Updating deal:', id, updates);

      const updateData = toDealUpdate(updates);

      const { data, error } = await supabase
        .from('deals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to update deal: ${error.message}`);
      }

      if (!data) {
        throw new Error('Deal updated but no data returned');
      }

      console.log('✅ Deal updated successfully:', data);
      return transformDeal(data);
    } catch (error) {
      console.error('❌ Error updating deal:', error);
      throw error;
    }
  }

  /**
   * Delete a deal
   */
  static async deleteDeal(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting deal:', id);

      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to delete deal: ${error.message}`);
      }

      console.log('✅ Deal deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting deal:', error);
      throw error;
    }
  }

  /**
   * Get deals by stage
   */
  static async getDealsByStage(stage: string): Promise<Deal[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('company_id', companyId)
        .eq('stage', stage)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch deals by stage: ${error.message}`);
      }

      return (data || []).map(transformDeal);
    } catch (error) {
      console.error('Error fetching deals by stage:', error);
      throw error;
    }
  }

  /**
   * Get deals for a specific contact
   */
  static async getDealsByContact(contactId: string): Promise<Deal[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('company_id', companyId)
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch deals for contact: ${error.message}`);
      }

      return (data || []).map(transformDeal);
    } catch (error) {
      console.error('Error fetching deals by contact:', error);
      throw error;
    }
  }

  /**
   * Get pipeline statistics
   */
  static async getPipelineStats(): Promise<{
    totalValue: number;
    dealCount: number;
    wonDeals: number;
    lostDeals: number;
    activeDeals: number;
    avgDealValue: number;
    stageDistribution: Record<string, number>;
  }> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        return {
          totalValue: 0,
          dealCount: 0,
          wonDeals: 0,
          lostDeals: 0,
          activeDeals: 0,
          avgDealValue: 0,
          stageDistribution: {},
        };
      }

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        throw new Error(`Failed to fetch pipeline stats: ${error.message}`);
      }

      const deals = (data || []).map(transformDeal);
      
      const wonDeals = deals.filter(d => d.stage === 'closed_won').length;
      const lostDeals = deals.filter(d => d.stage === 'closed_lost').length;
      const activeDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length;
      
      const totalValue = deals
        .filter(d => d.stage !== 'closed_lost')
        .reduce((sum, deal) => sum + deal.value, 0);

      const stageDistribution: Record<string, number> = {};
      deals.forEach(deal => {
        stageDistribution[deal.stage] = (stageDistribution[deal.stage] || 0) + 1;
      });

      return {
        totalValue,
        dealCount: deals.length,
        wonDeals,
        lostDeals,
        activeDeals,
        avgDealValue: deals.length > 0 ? totalValue / deals.length : 0,
        stageDistribution,
      };
    } catch (error) {
      console.error('Error calculating pipeline stats:', error);
      throw error;
    }
  }

  /**
   * Get deals closing soon (within specified days)
   */
  static async getDealsClosingSoon(withinDays: number = 7): Promise<Deal[]> {
    try {
      const companyId = await getCurrentCompanyId();
      
      if (!companyId) {
        return [];
      }

      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + withinDays);

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('company_id', companyId)
        .not('stage', 'in', '(closed_won,closed_lost)')
        .gte('expected_close_date', today.toISOString().split('T')[0])
        .lte('expected_close_date', futureDate.toISOString().split('T')[0])
        .order('expected_close_date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch deals closing soon: ${error.message}`);
      }

      return (data || []).map(transformDeal);
    } catch (error) {
      console.error('Error fetching deals closing soon:', error);
      throw error;
    }
  }

  /**
   * Subscribe to deal changes in real-time
   */
  static subscribeToDeals(callback: (deal: Deal) => void) {
    return supabase
      .channel('deals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals',
        },
        (payload) => {
          console.log('Deal change detected:', payload);
          if (payload.new) {
            callback(transformDeal(payload.new as DealRow));
          }
        }
      )
      .subscribe();
  }
}

export default SupabaseDealService;
