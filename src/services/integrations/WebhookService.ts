```typescript
import { logger } from '../../utils/monitoring/logger';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: Date;
}

class WebhookService {
  private static instance: WebhookService;
  private webhooks: Map<string, Webhook> = new Map();

  static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  async registerWebhook(url: string, events: string[]): Promise<Webhook> {
    try {
      const webhook: Webhook = {
        id: crypto.randomUUID(),
        url,
        events,
        secret: crypto.randomUUID(),
        active: true,
        createdAt: new Date()
      };

      this.webhooks.set(webhook.id, webhook);
      logger.info('Webhook registered', { webhookId: webhook.id, url });
      return webhook;
    } catch (error) {
      logger.error('Failed to register webhook', { error, url });
      throw error;
    }
  }

  async triggerWebhooks(event: string, payload: any): Promise<void> {
    const relevantWebhooks = Array.from(this.webhooks.values())
      .filter(webhook => webhook.active && webhook.events.includes(event));

    await Promise.all(relevantWebhooks.map(webhook => 
      this.sendWebhookRequest(webhook, event, payload)
    ));
  }

  private async sendWebhookRequest(webhook: Webhook, event: string, payload: any): Promise<void> {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': webhook.secret,
          'X-Event-Type': event
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      logger.info('Webhook triggered successfully', {
        webhookId: webhook.id,
        event
      });
    } catch (error) {
      logger.error('Webhook request failed', {
        error,
        webhookId: webhook.id,
        event
      });
    }
  }

  async deactivateWebhook(id: string): Promise<void> {
    const webhook = this.webhooks.get(id);
    if (webhook) {
      webhook.active = false;
      logger.info('Webhook deactivated', { webhookId: id });
    }
  }
}

export const webhookService = WebhookService.getInstance();
```