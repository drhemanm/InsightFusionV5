```typescript
import { z } from 'zod';

export const ContactSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  
  // Professional Information
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  organization: z.string().optional(),
  linkedAccounts: z.array(z.string()).optional(),

  // Address Information
  businessAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string()
  }).optional(),

  // Communication Preferences
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp', 'sms']),
  timezone: z.string().optional(),

  // Social Media Profiles
  socialProfiles: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional()
  }).optional(),

  // Engagement & Scoring
  score: z.number().min(0).max(100).optional(),
  engagementMetrics: z.object({
    emailsSent: z.number(),
    emailsReceived: z.number(),
    meetings: z.number(),
    lastInteraction: z.date()
  }).optional(),

  // Relationships
  relationships: z.array(z.object({
    contactId: z.string(),
    relationship: z.enum(['reports_to', 'manages', 'colleague', 'assistant']),
    notes: z.string().optional()
  })).optional(),

  // Categorization
  type: z.enum(['lead', 'customer', 'partner', 'supplier']),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),

  // Notes & Custom Fields
  notes: z.string().optional(),
  customFields: z.record(z.unknown()).optional()
});

export type Contact = z.infer<typeof ContactSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
```