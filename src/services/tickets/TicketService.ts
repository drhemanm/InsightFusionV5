import { supabase } from '../../config/supabase';
import { TicketSchema } from '../../types/tickets';
import { slaService } from './SLAService';
import { notificationService } from '../notification/NotificationService';
import { logger } from '../../utils/monitoring/logger';
import type { Ticket } from '../../types/tickets';

class TicketService {
  private static instance: TicketService;

  static getInstance(): TicketService {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService();
    }
    return TicketService.instance;
  }

  async createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    try {
      // Validate data
      const validatedData = await TicketSchema.parseAsync(data);

      // Calculate SLA
      const sla = await slaService.calculateSLA(validatedData.priority);

      // Create ticket using Supabase
      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert([{
          subject: validatedData.subject,
          description: validatedData.description,
          category: validatedData.category,
          priority: validatedData.priority,
          status: validatedData.status,
          assigned_to: validatedData.assignedTo,
          contact_id: validatedData.contactId,
          organization_id: validatedData.organizationId,
          resolution_notes: validatedData.resolutionNotes,
          attachments: validatedData.attachments || []
        }])
        .select()
        .single();

      if (error) throw error;

      const newTicket = {
        ...validatedData,
        id: ticket.id,
        sla,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Send notifications
      await this.sendTicketNotifications('created', newTicket);

      logger.info('Ticket created successfully', { ticketId: newTicket.id });
      return newTicket;
    } catch (error) {
      logger.error('Failed to create ticket', { error });
      throw error;
    }
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<void> {
    try {
      const docRef = doc(ticketsRef, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Check for status change
      if (updates.status) {
        await this.handleStatusChange(id, updates.status);
      }

      logger.info('Ticket updated successfully', { ticketId: id });
    } catch (error) {
      logger.error('Failed to update ticket', { error });
      throw error;
    }
  }

  async deleteTicket(id: string): Promise<void> {
    try {
      const docRef = doc(ticketsRef, id);
      await deleteDoc(docRef);
      logger.info('Ticket deleted successfully', { ticketId: id });
    } catch (error) {
      logger.error('Failed to delete ticket', { error });
      throw error;
    }
  }

  async getAllTickets(): Promise<Ticket[]> {
    try {
      const q = query(ticketsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Ticket);
    } catch (error) {
      logger.error('Failed to get tickets', { error });
      throw error;
    }
  }

  async getAssignedTickets(userId: string): Promise<Ticket[]> {
    try {
      const q = query(
        ticketsRef,
        where('assignedTo', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Ticket);
    } catch (error) {
      logger.error('Failed to get assigned tickets', { error });
      throw error;
    }
  }

  async filterTickets(filters: Partial<Record<'status' | 'priority' | 'category', string>>): Promise<Ticket[]> {
    try {
      let q = query(ticketsRef);

      // Add filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          q = query(q, where(field, '==', value));
        }
      });

      // Add sorting
      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Ticket);
    } catch (error) {
      logger.error('Failed to filter tickets', { error });
      throw error;
    }
  }

  private async handleStatusChange(ticketId: string, newStatus: string): Promise<void> {
    if (newStatus === 'resolved') {
      await slaService.markResolved(ticketId);
    }
    await this.sendTicketNotifications('status_changed', { id: ticketId, status: newStatus });
  }

  private async sendTicketNotifications(event: string, ticket: Partial<Ticket>): Promise<void> {
    try {
      switch (event) {
        case 'created':
          await notificationService.send({
            userId: ticket.assignedTo!,
            type: 'ticket_assigned',
            title: 'New Ticket Assigned',
            message: `Ticket #${ticket.ticketId} has been assigned to you`
          });
          break;

        case 'status_changed':
          await notificationService.send({
            userId: ticket.assignedTo!,
            type: 'ticket_updated',
            title: 'Ticket Status Updated',
            message: `Ticket #${ticket.ticketId} status changed to ${ticket.status}`
          });
          break;
      }
    } catch (error) {
      logger.error('Failed to send ticket notification', { error });
    }
  }
}

export const ticketService = TicketService.getInstance();