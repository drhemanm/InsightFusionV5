import { create } from 'zustand';
import { FirebaseTicketService } from '../services/firebase/ticketService';
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
      const tickets = await FirebaseTicketService.getTickets();
      set({ tickets, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch tickets', { error });
      set({ error: 'Failed to fetch tickets', isLoading: false });
    }
  },

  createTicket: async (ticketData) => {
    set({ isLoading: true, error: null });
    try {
      const ticket = await FirebaseTicketService.createTicket(ticketData);
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
      await FirebaseTicketService.updateTicket(id, updates);
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
      await FirebaseTicketService.deleteTicket(id);
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
      // For now, just fetch all tickets and filter client-side
      // In production, you'd implement proper Firestore queries
      const allTickets = await FirebaseTicketService.getTickets();
      const filteredTickets = allTickets.filter(ticket => {
        return Object.entries(filters).every(([field, value]) => {
          if (!value) return true;
          return ticket[field as keyof Ticket] === value;
        });
      });

      set({ tickets: filteredTickets, isLoading: false });
    } catch (error) {
      logger.error('Failed to filter tickets', { error });
      set({ error: 'Failed to filter tickets', isLoading: false });
    }
  }
}));