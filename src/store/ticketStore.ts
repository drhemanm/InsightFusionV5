import { create } from 'zustand';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketStore {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  setSelectedTicket: (ticket: Ticket | null) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  selectedTicket: null,
  isLoading: false,
  error: null,
  
  fetchTickets: async () => {
    // TODO: Implement with Supabase when tickets table is added
    set({ tickets: [], isLoading: false });
  },
  
  setSelectedTicket: (ticket) => {
    set({ selectedTicket: ticket });
  },
}));
