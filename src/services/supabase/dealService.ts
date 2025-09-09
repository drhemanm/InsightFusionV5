import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { Deal } from '../../types/deals';

export class SupabaseDealService {
  static async createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    try {
      const { data: deal, error } = await supabase
        .from('deals')
        .insert([{
          title: data.title,
          description: data.description,
          value: data.value,
          currency: 'MUR',
          stage: data.stage,
          status: data.status,
          priority: data.priority,
          probability: data.probability,
          assigned_to: data.assignedTo,
          contact_id: data.contactId,
          organization_id: data.organizationId,
          expected_close_date: data.expectedCloseDate?.toISOString(),
          notes: data.notes
        }])
        .select()
        .single();

      if (error) {
        logger.error('Failed to create deal', { error });
        throw error;
      }

      logger.info('Deal created successfully', { dealId: deal.id });
      return this.transformDeal(deal);
    } catch (error) {
      logger.error('Deal creation failed', { error });
      throw error;
    }
  }

  static async getDeals(): Promise<Deal[]> {
    try {
      const { data: deals, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch deals', { error });
        throw error;
      }

      return deals.map(this.transformDeal);
    } catch (error) {
      logger.error('Failed to fetch deals', { error });
      throw error;
    }
  }

  static async updateDeal(id: string, updates: Partial<Deal>): Promise<void> {
    try {
      const { error } = await supabase
        .from('deals')
        .update({
          title: updates.title,
          description: updates.description,
          value: updates.value,
          stage: updates.stage,
          status: updates.status,
          priority: updates.priority,
          probability: updates.probability,
          assigned_to: updates.assignedTo,
          contact_id: updates.contactId,
          organization_id: updates.organizationId,
          expected_close_date: updates.expectedCloseDate?.toISOString(),
          actual_close_date: updates.actualCloseDate?.toISOString(),
          notes: updates.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        logger.error('Failed to update deal', { error, dealId: id });
        throw error;
      }

      logger.info('Deal updated successfully', { dealId: id });
    } catch (error) {
      logger.error('Deal update failed', { error, dealId: id });
      throw error;
    }
  }

  static async deleteDeal(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Failed to delete deal', { error, dealId: id });
        throw error;
      }

      logger.info('Deal deleted successfully', { dealId: id });
    } catch (error) {
      logger.error('Deal deletion failed', { error, dealId: id });
      throw error;
    }
  }

  static transformDeal(supabaseDeal: any): Deal {
    return {
      id: supabaseDeal.id,
      title: supabaseDeal.title,
      description: supabaseDeal.description,
      value: supabaseDeal.value,
      stage: supabaseDeal.stage,
      status: supabaseDeal.status,
      priority: supabaseDeal.priority,
      probability: supabaseDeal.probability,
      assignedTo: supabaseDeal.assigned_to,
      contactId: supabaseDeal.contact_id,
      organizationId: supabaseDeal.organization_id,
      expectedCloseDate: supabaseDeal.expected_close_date ? new Date(supabaseDeal.expected_close_date) : undefined,
      actualCloseDate: supabaseDeal.actual_close_date ? new Date(supabaseDeal.actual_close_date) : undefined,
      notes: supabaseDeal.notes,
      createdAt: new Date(supabaseDeal.created_at),
      updatedAt: new Date(supabaseDeal.updated_at)
    };
  }
}