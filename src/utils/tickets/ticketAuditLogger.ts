import { logger } from '../monitoring/logger';
import type { User } from '../../types/auth';
import type { Ticket } from '../../types/tickets';

interface AuditLog {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  changes?: {
    before: Partial<Ticket>;
    after: Partial<Ticket>;
  };
  timestamp: Date;
}

export class TicketAuditLogger {
  private static auditLogs: AuditLog[] = [];

  static logTicketCreation(ticket: Ticket, user: User): void {
    this.createAuditLog(ticket.id, user.id, 'created', {
      before: {},
      after: ticket
    });
  }

  static logTicketUpdate(
    ticketId: string,
    userId: string,
    before: Partial<Ticket>,
    after: Partial<Ticket>
  ): void {
    this.createAuditLog(ticketId, userId, 'updated', { before, after });
  }

  static logTicketAssignment(
    ticketId: string,
    userId: string,
    oldAssignee: string | null,
    newAssignee: string
  ): void {
    this.createAuditLog(ticketId, userId, 'assigned', {
      before: { assignedTo: oldAssignee },
      after: { assignedTo: newAssignee }
    });
  }

  private static createAuditLog(
    ticketId: string,
    userId: string,
    action: string,
    changes?: AuditLog['changes']
  ): void {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      ticketId,
      userId,
      action,
      changes,
      timestamp: new Date()
    };

    this.auditLogs.push(log);
    logger.info('Ticket audit log created', { 
      ticketId,
      action,
      userId 
    });
  }

  static getTicketHistory(ticketId: string): AuditLog[] {
    return this.auditLogs
      .filter(log => log.ticketId === ticketId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}