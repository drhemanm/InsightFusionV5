```typescript
import { logger } from '../../utils/monitoring/logger';
import type { Contact } from '../../types/contacts';

interface EngagementMetric {
  contactId: string;
  type: 'email' | 'call' | 'meeting' | 'social';
  timestamp: Date;
  duration?: number;
  outcome?: string;
}

class ContactEngagementService {
  private static instance: ContactEngagementService;
  private metrics: EngagementMetric[] = [];

  static getInstance(): ContactEngagementService {
    if (!ContactEngagementService.instance) {
      ContactEngagementService.instance = new ContactEngagementService();
    }
    return ContactEngagementService.instance;
  }

  async recordEngagement(metric: Omit<EngagementMetric, 'timestamp'>): Promise<void> {
    try {
      const engagement: EngagementMetric = {
        ...metric,
        timestamp: new Date()
      };

      this.metrics.push(engagement);
      logger.info('Engagement recorded', { engagement });
    } catch (error) {
      logger.error('Failed to record engagement', { error });
      throw error;
    }
  }

  async getEngagementMetrics(contactId: string): Promise<{
    totalInteractions: number;
    lastInteraction: Date | null;
    interactionsByType: Record<string, number>;
    averageDuration: number;
  }> {
    const contactMetrics = this.metrics.filter(m => m.contactId === contactId);

    const interactionsByType = contactMetrics.reduce((acc, metric) => {
      acc[metric.type] = (acc[metric.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const durations = contactMetrics
      .filter(m => m.duration)
      .map(m => m.duration!);

    return {
      totalInteractions: contactMetrics.length,
      lastInteraction: contactMetrics.length > 0 
        ? contactMetrics[contactMetrics.length - 1].timestamp 
        : null,
      interactionsByType,
      averageDuration: durations.length > 0 
        ? durations.reduce((a, b) => a + b, 0) / durations.length 
        : 0
    };
  }

  async getEngagementScore(contactId: string): Promise<number> {
    const metrics = await this.getEngagementMetrics(contactId);
    
    // Calculate score based on:
    // - Recency of interactions
    // - Frequency of interactions
    // - Diversity of interaction types
    // - Average duration of interactions
    
    let score = 0;
    
    // Base score from total interactions (max 40 points)
    score += Math.min(metrics.totalInteractions * 2, 40);
    
    // Recency bonus (max 30 points)
    if (metrics.lastInteraction) {
      const daysSinceLastInteraction = Math.floor(
        (Date.now() - metrics.lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
      );
      score += Math.max(0, 30 - daysSinceLastInteraction);
    }
    
    // Diversity bonus (max 30 points)
    score += Object.keys(metrics.interactionsByType).length * 10;
    
    return Math.min(score, 100);
  }
}

export const contactEngagementService = ContactEngagementService.getInstance();
```