```typescript
import { logger } from '../../utils/monitoring/logger';

interface KYCDocument {
  type: 'passport' | 'drivers_license' | 'national_id';
  file: File;
  metadata: {
    issuedDate: Date;
    expiryDate: Date;
    issuingCountry: string;
  };
}

interface VerificationResult {
  status: 'verified' | 'rejected' | 'pending';
  remarks?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

class KYCService {
  private static instance: KYCService;

  private constructor() {}

  static getInstance(): KYCService {
    if (!KYCService.instance) {
      KYCService.instance = new KYCService();
    }
    return KYCService.instance;
  }

  async uploadDocument(contactId: string, document: KYCDocument): Promise<string> {
    try {
      // In production, implement Supabase Storage upload
      const fileName = \`kyc/${contactId}/${document.type}_${Date.now()}`;
      
      // For now, return a mock URL - replace with actual Supabase Storage implementation
      const downloadUrl = \`https://example.com/uploads/${fileName}`;
      
      logger.info('KYC document uploaded', { 
        contactId, 
        documentType: document.type 
      });

      return downloadUrl;
    } catch (error) {
      logger.error('Failed to upload KYC document', { error, contactId });
      throw error;
    }
  }

  async verifyDocument(
    contactId: string,
    documentUrl: string,
    verificationData: VerificationResult
  ): Promise<void> {
    try {
      // In production, implement actual document verification logic
      logger.info('KYC document verified', {
        contactId,
        status: verificationData.status
      });
    } catch (error) {
      logger.error('Failed to verify KYC document', { error, contactId });
      throw error;
    }
  }

  isDocumentExpired(expiryDate: Date): boolean {
    return expiryDate < new Date();
  }

  getDocumentStatus(document: KYCDocument): 'valid' | 'expiring_soon' | 'expired' {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));

    if (document.metadata.expiryDate < now) {
      return 'expired';
    }
    if (document.metadata.expiryDate < thirtyDaysFromNow) {
      return 'expiring_soon';
    }
    return 'valid';
  }
}

export const kycService = KYCService.getInstance();
```