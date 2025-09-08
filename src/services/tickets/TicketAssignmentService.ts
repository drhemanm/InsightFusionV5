import { logger } from '../../utils/monitoring/logger';
import type { Ticket } from '../../types/tickets';

interface AssignmentRule {
  category: string;
  priority: string;
  assigneeId: string;
}

class TicketAssignmentService {
  private static instance: TicketAssignmentService;
  private rules: AssignmentRule[] = [];
  private roundRobinIndex: number = 0;

  static getInstance(): TicketAssignmentService {
    if (!TicketAssignmentService.instance) {
      TicketAssignmentService.instance = new TicketAssignmentService();
    }
    return TicketAssignmentService.instance;
  }

  async assignTicket(ticket: Ticket): Promise<string> {
    try {
      // Check automatic assignment rules
      for (const rule of this.rules) {
        if (this.matchesRule(ticket, rule)) {
          logger.info('Ticket automatically assigned', {
            ticketId: ticket.id,
            assigneeId: rule.assigneeId
          });
          return rule.assigneeId;
        }
      }

      // Fall back to round-robin assignment
      const defaultAssignees = ['agent1', 'agent2', 'agent3'];
      const assigneeId = defaultAssignees[this.roundRobinIndex % defaultAssignees.length];
      this.roundRobinIndex++;

      logger.info('Ticket assigned via round-robin', {
        ticketId: ticket.id,
        assigneeId
      });

      return assigneeId;
    } catch (error) {
      logger.error('Failed to assign ticket', { error });
      throw error;
    }
  }

  private matchesRule(ticket: Ticket, rule: AssignmentRule): boolean {
    return ticket.category === rule.category && ticket.priority === rule.priority;
  }

  addAssignmentRule(rule: AssignmentRule): void {
    this.rules.push(rule);
    logger.info('Assignment rule added', { rule });
  }
}

export const ticketAssignmentService = TicketAssignmentService.getInstance();