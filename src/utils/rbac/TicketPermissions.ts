import { RoleManager } from './RoleManager';
import type { User } from '../../types/auth';
import type { Ticket } from '../../types/tickets';

export class TicketPermissions {
  static canViewTicket(user: User, ticket: Ticket): boolean {
    return (
      user.role === 'admin' ||
      ticket.assignedTo === user.id
    );
  }

  static canAssignTicket(user: User): boolean {
    return user.role === 'admin';
  }

  static canUpdateTicket(user: User, ticket: Ticket): boolean {
    return (
      user.role === 'admin' ||
      ticket.assignedTo === user.id
    );
  }

  static canDeleteTicket(user: User): boolean {
    return user.role === 'admin';
  }

  static canViewAllTickets(user: User): boolean {
    return user.role === 'admin';
  }

  static filterVisibleTickets(user: User, tickets: Ticket[]): Ticket[] {
    if (user.role === 'admin') return tickets;
    return tickets.filter(ticket => ticket.assignedTo === user.id);
  }
}