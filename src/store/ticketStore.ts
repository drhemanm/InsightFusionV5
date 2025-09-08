import { create } from 'zustand';
import { SupabaseTicketService } from '../services/supabase/ticketService';
import { logger } from '../utils/monitoring/logger';
import type { Ticket } from '../types/tickets';

interface TicketStore {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  createTicket: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Ticket>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  filterTickets: (filters: Partial<Record<'status' | 'priority' | 'category', string>>) => Promise<void>;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  isLoading: false,
  error: null,

  fetchTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      const tickets = await SupabaseTicketService.getTickets();
      set({ tickets, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch tickets', { error });
      set({ error: 'Failed to fetch tickets', isLoading: false });
    }
  },

  createTicket: async (ticketData) => {
    set({ isLoading: true, error: null });
    try {
      const ticket = await SupabaseTicketService.createTicket(ticketData);
      set(state => ({
        tickets: [ticket, ...state.tickets],
        isLoading: false
      }));
      return ticket;
    } catch (error) {
      logger.error('Failed to create ticket', { error });
      set({ error: 'Failed to create ticket', isLoading: false });
      throw error;
    }
  },

  updateTicket: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await SupabaseTicketService.updateTicket(id, updates);
      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === id ? { ...ticket, ...updates } : ticket
        ),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to update ticket', { error });
      set({ error: 'Failed to update ticket', isLoading: false });
      throw error;
    }
  },

  deleteTicket: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        tickets: state.tickets.filter(ticket => ticket.id !== id),
        isLoading: false
      }));
    } catch (error) {
      logger.error('Failed to delete ticket', { error });
      set({ error: 'Failed to delete ticket', isLoading: false });
      throw error;
    }
  },

  filterTickets: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('tickets').select('*');

      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          query = query.eq(field, value);
        }
      });

      const { data: tickets, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      set({ 
        tickets: tickets.map(SupabaseTicketService.transformTicket), 
        isLoading: false 
      });
    } catch (error) {
      logger.error('Failed to filter tickets', { error });
      set({ error: 'Failed to filter tickets', isLoading: false });
    }
  }
}));