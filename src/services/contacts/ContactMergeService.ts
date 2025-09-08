```typescript
import { logger } from '../../utils/monitoring/logger';
import { contactService } from './ContactService';
import type { Contact } from '../../types/contacts';

interface MergeResult {
  success: boolean;
  mergedContact: Contact;
  deletedIds: string[];
  error?: string;
}

class ContactMergeService {
  private static instance: ContactMergeService;

  static getInstance(): ContactMergeService {
    if (!ContactMergeService.instance) {
      ContactMergeService.instance = new ContactMergeService();
    }
    return ContactMergeService.instance;
  }

  async mergeContacts(contacts: Contact[]): Promise<MergeResult> {
    try {
      if (contacts.length < 2) {
        throw new Error('At least two contacts are required for merging');
      }

      // Sort contacts by last update time to use most recent as primary
      const sortedContacts = [...contacts].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );

      const primaryContact = sortedContacts[0];
      const mergedData = this.mergeContactData(sortedContacts);

      // Update primary contact with merged data
      await contactService.updateContact(primaryContact.id, mergedData);

      // Delete other contacts
      const deletedIds: string[] = [];
      for (let i = 1; i < sortedContacts.length; i++) {
        await contactService.deleteContact(sortedContacts[i].id);
        deletedIds.push(sortedContacts[i].id);
      }

      logger.info('Contacts merged successfully', {
        primaryId: primaryContact.id,
        deletedIds
      });

      return {
        success: true,
        mergedContact: { ...primaryContact, ...mergedData },
        deletedIds
      };
    } catch (error) {
      logger.error('Failed to merge contacts', { error });
      return {
        success: false,
        mergedContact: contacts[0],
        deletedIds: [],
        error: error instanceof Error ? error.message : 'Failed to merge contacts'
      };
    }
  }

  private mergeContactData(contacts: Contact[]): Partial<Contact> {
    const merged: any = { ...contacts[0] };

    // Merge arrays and objects from all contacts
    contacts.forEach(contact => {
      // Merge tags
      if (contact.tags) {
        merged.tags = [...new Set([...merged.tags || [], ...contact.tags])];
      }

      // Merge custom fields
      if (contact.customFields) {
        merged.customFields = {
          ...merged.customFields,
          ...contact.customFields
        };
      }

      // Keep most complete data
      if (!merged.phone && contact.phone) {
        merged.phone = contact.phone;
      }
      if (!merged.organization && contact.organization) {
        merged.organization = contact.organization;
      }
      if (!merged.jobTitle && contact.jobTitle) {
        merged.jobTitle = contact.jobTitle;
      }
    });

    return merged;
  }
}

export const contactMergeService = ContactMergeService.getInstance();
```