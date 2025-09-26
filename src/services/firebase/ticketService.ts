import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Ticket, TicketStatus, TicketPriority } from '../../types/tickets';

export const ticketService = {
  // Create a new ticket
  async createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'tickets'), {
        ...ticketData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Get all tickets
  async getTickets(): Promise<Ticket[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Ticket[];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Get tickets by status
  async getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'tickets'), 
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        )
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Ticket[];
    } catch (error) {
      console.error('Error fetching tickets by status:', error);
      throw error;
    }
  },

  // Update ticket
  async updateTicket(ticketId: string, updates: Partial<Ticket>): Promise<void> {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Delete ticket
  async deleteTicket(ticketId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },

  // Get tickets by assignee
  async getTicketsByAssignee(assigneeId: string): Promise<Ticket[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'tickets'), 
          where('assignedTo', '==', assigneeId),
          orderBy('createdAt', 'desc')
        )
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Ticket[];
    } catch (error) {
      console.error('Error fetching tickets by assignee:', error);
      throw error;
    }
  }
};