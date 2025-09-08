```typescript
import { Contact } from '../../types/contacts';
import { logger } from '../../utils/monitoring/logger';

interface ScoringCriteria {
  engagementWeight: number;
  valueWeight: number;
  activityWeight: number;
}

class ContactScoringService {
  private static instance: ContactScoringService;
  private readonly defaultCriteria: ScoringCriteria = {
    engagementWeight: 0.4,
    valueWeight: 0.3,
    activityWeight: 0.3
  };

  private constructor() {}

  static getInstance(): ContactScoringService {
    if (!ContactScoringService.instance) {
      ContactScoringService.instance = new ContactScoringService();
    }
    return ContactScoringService.instance;
  }

  async calculateScore(contact: Contact, criteria: Partial<ScoringCriteria> = {}): Promise<number> {
    try {
      const { engagementWeight, valueWeight, activityWeight } = {
        ...this.defaultCriteria,
        ...criteria
      };

      const engagementScore = this.calculateEngagementScore(contact);
      const valueScore = this.calculateValueScore(contact);
      const activityScore = this.calculateActivityScore(contact);

      const totalScore = (
        engagementScore * engagementWeight +
        valueScore * valueWeight +
        activityScore * activityWeight
      );

      return Math.round(totalScore);
    } catch (error) {
      logger.error('Failed to calculate contact score', { error, contactId: contact.id });
      return 0;
    }
  }

  private calculateEngagementScore(contact: Contact): number {
    if (!contact.engagementMetrics) return 0;

    const {
      emailsSent,
      emailsReceived,
      meetings,
      lastInteraction
    } = contact.engagementMetrics;

    // Calculate recency score (higher for more recent interactions)
    const daysSinceLastInteraction = Math.floor(
      (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
    );
    const recencyScore = Math.max(0, 100 - daysSinceLastInteraction);

    // Calculate interaction score
    const interactionScore = (
      (emailsSent + emailsReceived) * 2 + // Each email worth 2 points
      meetings * 5 // Each meeting worth 5 points
    );

    return (recencyScore + Math.min(interactionScore, 100)) / 2;
  }

  private calculateValueScore(contact: Contact): number {
    // Implementation would consider:
    // - Deal values
    // - Company size/revenue
    // - Strategic importance
    return 50; // Placeholder implementation
  }

  private calculateActivityScore(contact: Contact): number {
    // Implementation would consider:
    // - Frequency of interactions
    // - Response rates
    // - Meeting attendance
    return 50; // Placeholder implementation
  }
}

export const contactScoringService = ContactScoringService.getInstance();
```