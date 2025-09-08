```typescript
import { logger } from '../../utils/monitoring/logger';
import type { Contact } from '../../types/contacts';

interface HierarchyRelation {
  contactId: string;
  relatedContactId: string;
  relationType: 'reports_to' | 'manages' | 'colleague' | 'assistant';
  notes?: string;
}

class ContactHierarchyService {
  private static instance: ContactHierarchyService;
  private relationships: HierarchyRelation[] = [];

  static getInstance(): ContactHierarchyService {
    if (!ContactHierarchyService.instance) {
      ContactHierarchyService.instance = new ContactHierarchyService();
    }
    return ContactHierarchyService.instance;
  }

  async addRelationship(relation: HierarchyRelation): Promise<void> {
    try {
      // Add the direct relationship
      this.relationships.push(relation);

      // Add reciprocal relationship if applicable
      if (relation.relationType === 'reports_to') {
        this.relationships.push({
          contactId: relation.relatedContactId,
          relatedContactId: relation.contactId,
          relationType: 'manages'
        });
      }

      logger.info('Contact relationship added', { relation });
    } catch (error) {
      logger.error('Failed to add contact relationship', { error });
      throw error;
    }
  }

  async getDirectReports(managerId: string): Promise<string[]> {
    return this.relationships
      .filter(r => r.relatedContactId === managerId && r.relationType === 'reports_to')
      .map(r => r.contactId);
  }

  async getManager(employeeId: string): Promise<string | null> {
    const relation = this.relationships.find(
      r => r.contactId === employeeId && r.relationType === 'reports_to'
    );
    return relation?.relatedContactId || null;
  }

  async getColleagues(contactId: string): Promise<string[]> {
    return this.relationships
      .filter(r => r.contactId === contactId && r.relationType === 'colleague')
      .map(r => r.relatedContactId);
  }

  async getOrganizationChart(rootContactId: string): Promise<any> {
    const chart: any = { id: rootContactId, children: [] };
    const directReports = await this.getDirectReports(rootContactId);
    
    for (const reportId of directReports) {
      chart.children.push(await this.getOrganizationChart(reportId));
    }

    return chart;
  }
}

export const contactHierarchyService = ContactHierarchyService.getInstance();
```