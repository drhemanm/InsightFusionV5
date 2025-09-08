```typescript
import { logger } from '../../utils/monitoring/logger';
import type { Contact } from '../../types/contacts';

interface AssignmentRule {
  type: 'region' | 'industry' | 'value' | 'round_robin';
  condition: (contact: Contact) => boolean;
  assigneeIds: string[];
}

class LeadAssignmentService {
  private static instance: LeadAssignmentService;
  private rules: AssignmentRule[] = [];
  private roundRobinIndex: number = 0;

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): LeadAssignmentService {
    if (!LeadAssignmentService.instance) {
      LeadAssignmentService.instance = new LeadAssignmentService();
    }
    return LeadAssignmentService.instance;
  }

  private initializeDefaultRules() {
    // Example rules - in production, these would be loaded from configuration
    this.rules = [
      {
        type: 'value',
        condition: (contact) => 
          contact.organization?.toLowerCase().includes('enterprise'),
        assigneeIds: ['enterprise-team-1', 'enterprise-team-2']
      },
      {
        type: 'industry',
        condition: (contact) => 
          contact.customFields?.industry === 'technology',
        assigneeIds: ['tech-team-1', 'tech-team-2']
      },
      {
        type: 'region',
        condition: (contact) => 
          contact.businessAddress?.country === 'US',
        assigneeIds: ['us-team-1', 'us-team-2']
      }
    ];
  }

  async assignLead(contact: Contact): Promise<string> {
    try {
      // Check automatic assignment rules
      for (const rule of this.rules) {
        if (rule.condition(contact)) {
          const assigneeId = this.getNextAssignee(rule.assigneeIds);
          
          logger.info('Lead automatically assigned', {
            contactId: contact.id,
            assigneeId,
            ruleType: rule.type
          });
          
          return assigneeId;
        }
      }

      // If no rules match, use round-robin assignment
      const defaultAssignees = ['default-team-1', 'default-team-2'];
      const assigneeId = this.getNextAssignee(defaultAssignees);
      
      logger.info('Lead assigned via round-robin', {
        contactId: contact.id,
        assigneeId
      });
      
      return assigneeId;
    } catch (error) {
      logger.error('Lead assignment failed', { error, contactId: contact.id });
      throw error;
    }
  }

  private getNextAssignee(assignees: string[]): string {
    const assigneeId = assignees[this.roundRobinIndex % assignees.length];
    this.roundRobinIndex++;
    return assigneeId;
  }

  addAssignmentRule(rule: AssignmentRule): void {
    this.rules.push(rule);
    logger.info('Assignment rule added', { ruleType: rule.type });
  }
}

export const leadAssignmentService = LeadAssignmentService.getInstance();
```