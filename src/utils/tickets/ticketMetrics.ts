import { differenceInHours } from 'date-fns';
import type { Ticket, TicketMetrics } from '../../types/tickets';

export class TicketMetricsCalculator {
  static calculateMetrics(tickets: Ticket[]): TicketMetrics {
    const activeTickets = tickets.filter(t => 
      t.status !== 'resolved' && t.status !== 'closed'
    );

    const resolvedTickets = tickets.filter(t => t.status === 'resolved');
    const resolutionTimes = resolvedTickets.map(t => 
      differenceInHours(new Date(t.updatedAt), new Date(t.createdAt))
    );

    const avgResolutionTime = resolutionTimes.length > 0
      ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
      : 0;

    const priorityDistribution = this.calculateDistribution(tickets, 'priority');
    const statusDistribution = this.calculateDistribution(tickets, 'status');
    const topCategories = this.getTopCategories(tickets);
    const weeklyTrend = this.calculateWeeklyTrend(tickets);
    const resolutionRate = resolvedTickets.length / tickets.length * 100;

    return {
      totalActive: activeTickets.length,
      avgResolutionTime,
      priorityDistribution,
      statusDistribution,
      topCategories,
      weeklyTrend,
      resolutionRate
    };
  }

  private static calculateDistribution(
    tickets: Ticket[],
    field: 'priority' | 'status'
  ): Record<string, number> {
    return tickets.reduce((acc, ticket) => {
      const value = ticket[field];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static getTopCategories(tickets: Ticket[]): Array<{ category: string; count: number }> {
    const categories = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private static calculateWeeklyTrend(tickets: Ticket[]): Array<{ date: string; count: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      count: tickets.filter(t => 
        t.createdAt.toISOString().startsWith(date)
      ).length
    }));
  }
}