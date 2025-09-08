import { z } from 'zod';

export const CampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum(['email', 'social_media', 'event', 'direct_mail', 'phone', 'referral']),
  description: z.string().optional(),
  budget: z.number().min(0, 'Budget must be non-negative'),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']),
  createdBy: z.string().uuid(),
  managerId: z.string().uuid().optional(),
  kpis: z.record(z.unknown()).default({}),
  metrics: z.record(z.unknown()).default({}),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CampaignTargetSchema = z.object({
  id: z.string().uuid(),
  campaignId: z.string().uuid(),
  targetType: z.enum(['contact', 'organization']),
  targetId: z.string().uuid(),
  status: z.enum(['pending', 'contacted', 'responded', 'converted', 'rejected']),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Campaign = z.infer<typeof CampaignSchema>;
export type CampaignTarget = z.infer<typeof CampaignTargetSchema>;