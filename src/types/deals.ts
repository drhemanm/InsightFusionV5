import { z } from 'zod';

export const DealSchema = z.object({
  title: z.string().min(1, 'Deal title is required'),
  description: z.string().optional(),
  value: z.number().min(0, 'Deal value must be positive'),
  stage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
  status: z.enum([
    'new_lead',
    'initial_contact',
    'in_negotiation',
    'proposal_sent',
    'contract_pending',
    'closed_won',
    'closed_lost',
    'on_hold'
  ]).default('new_lead'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  assignedTo: z.string(),
  contactId: z.string().optional(),
  organizationId: z.string().optional(),
  expectedCloseDate: z.date().optional(),
  actualCloseDate: z.date().optional()
});

export type Deal = z.infer<typeof DealSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};