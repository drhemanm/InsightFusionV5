import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { logger } from '../../utils/monitoring/logger';
import type { Ticket } from '../../types/tickets';

const COLLECTION = 'tickets';
const ticketsRef = collection(db, COLLECTION);

export class FirebaseTicketService {
  static async createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    try {
      const docRef = doc(ticketsRef);
      const ticket: Ticket = {
        ...data,
        id: docRef.id,
        ticketId: this.generateTicketId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, {
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
      });

      logger.info('Ticket created successfully', { ticketId: ticket.id });
      return ticket;
    } catch (error) {
      logger.error('Ticket creation failed', { error });
      throw error;
    }
  }

  static async getTickets(): Promise<Ticket[]> {
    try {
      const q = query(ticketsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const tickets = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        } as Ticket;
      });

      return tickets;
    } catch (error) {
      logger.error('Failed to fetch tickets', { error });
      throw error;
    }
  }

  static async updateTicket(id: string, updates: Partial<Ticket>): Promise<void> {
    try {
      const docRef = doc(ticketsRef, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      logger.info('Ticket updated successfully', { ticketId: id });
    } catch (error) {
      logger.error('Ticket update failed', { error, ticketId: id });
      throw error;
    }
  }

  private static generateTicketId(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}-${month}-${sequence}`;
  }
}