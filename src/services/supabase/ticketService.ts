import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { Ticket } from '../../types/tickets';

export class SupabaseTicketService {
  static async createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    try {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert([{
          subject: data.subject,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: data.status,
          assigned_to: data.assignedTo,
          contact_id: data.contactId,
          organization_id: data.organizationId,
          resolution_notes: data.resolutionNotes,
          attachments: data.attachments
        }])
        .select()
        .single();

      if (error) {
        logger.error('Failed to create ticket', { error });
        throw error;
      }

      logger.info('Ticket created successfully', { ticketId: ticket.id });
      return this.transformTicket(ticket);
    } catch (error) {
      logger.error('Ticket creation failed', { error });
      throw error;
    }
  }

  static async getTickets(): Promise<Ticket[]> {
    try {
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch tickets', { error });
        throw error;
      }

      return tickets.map(this.transformTicket);
    } catch (error) {
      logger.error('Failed to fetch tickets', { error });
      throw error;
    }
  }

  static async updateTicket(id: string, updates: Partial<Ticket>): Promise<void> {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          subject: updates.subject,
          description: updates.description,
          category: updates.category,
          priority: updates.priority,
          status: updates.status,
          assigned_to: updates.assignedTo,
          contact_id: updates.contactId,
          organization_id: updates.organizationId,
          resolution_notes: updates.resolutionNotes,
          attachments: updates.attachments,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        logger.error('Failed to update ticket', { error, ticketId: id });
        throw error;
      }

      logger.info('Ticket updated successfully', { ticketId: id });
    } catch (error) {
      logger.error('Ticket update failed', { error, ticketId: id });
      throw error;
    }
  }

  static transformTicket(supabaseTicket: any): Ticket {
    return {
      id: supabaseTicket.id,
      ticketId: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      subject: supabaseTicket.subject,
      description: supabaseTicket.description,
      category: supabaseTicket.category,
      priority: supabaseTicket.priority,
      status: supabaseTicket.status,
      assignedTo: supabaseTicket.assigned_to,
      contactId: supabaseTicket.contact_id,
      organizationId: supabaseTicket.organization_id,
      resolutionNotes: supabaseTicket.resolution_notes,
      attachments: supabaseTicket.attachments || [],
      createdAt: new Date(supabaseTicket.created_at),
      updatedAt: new Date(supabaseTicket.updated_at)
    };
  }
}