import { format } from 'date-fns';

export class TicketIdGenerator {
  private static lastSequence = 0;

  static generateTicketId(): string {
    const now = new Date();
    const year = format(now, 'yy');
    const month = format(now, 'MM');
    
    // Increment sequence
    this.lastSequence = (this.lastSequence + 1) % 1000;
    
    // Format sequence as 3 digits with leading zeros
    const sequence = this.lastSequence.toString().padStart(3, '0');
    
    return `${year}${month}-${sequence}`;
  }
}