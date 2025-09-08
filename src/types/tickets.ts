import { z } from 'zod';

export const TicketSchema = z.object({
  id: z.string(),
  ticketId: z.string(), // YY-MM-XXX format
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['technical', 'billing', 'inquiry', 'feature_request', 'bug_report']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  assignedTo: z.string(),
  contactId: z.string(),
  organizationId: z.string().optional(),
  resolutionNotes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Ticket = z.infer<typeof TicketSchema>;

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt: Date;
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  changes: {
    field: string;
    from: any;
    to: any;
  };
  timestamp: Date;
}

export interface TicketMetrics {
  totalActive: number;
  avgResolutionTime: number;
  priorityDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  topCategories: Array<{ category: string; count: number }>;
  weeklyTrend: Array<{ date: string; count: number }>;
  resolutionRate: number;
}