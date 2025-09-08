import { logger } from '../../utils/monitoring/logger';
import type { PredictiveModel, Prediction } from '../../types/analytics';

class PredictiveAnalyticsService {
  private static instance: PredictiveAnalyticsService;
  private models: Map<string, PredictiveModel> = new Map();

  private constructor() {
    this.initializeModels();
  }

  static getInstance(): PredictiveAnalyticsService {
    if (!PredictiveAnalyticsService.instance) {
      PredictiveAnalyticsService.instance = new PredictiveAnalyticsService();
    }
    return PredictiveAnalyticsService.instance;
  }

  private initializeModels(): void {
    const defaultModels: PredictiveModel[] = [
      {
        id: 'lead-scoring-v1',
        name: 'Lead Scoring Model',
        type: 'lead_scoring',
        accuracy: 0.87,
        lastTrained: new Date(),
        features: ['email_engagement', 'website_visits', 'company_size', 'industry', 'job_title'],
        status: 'active'
      },
      {
        id: 'deal-probability-v1',
        name: 'Deal Win Probability',
        type: 'deal_probability',
        accuracy: 0.82,
        lastTrained: new Date(),
        features: ['deal_value', 'stage_duration', 'contact_engagement', 'competitor_presence'],
        status: 'active'
      },
      {
        id: 'churn-prediction-v1',
        name: 'Customer Churn Prediction',
        type: 'churn_prediction',
        accuracy: 0.79,
        lastTrained: new Date(),
        features: ['last_interaction', 'support_tickets', 'usage_frequency', 'satisfaction_score'],
        status: 'active'
      },
      {
        id: 'revenue-forecast-v1',
        name: 'Revenue Forecasting',
        type: 'revenue_forecast',
        accuracy: 0.85,
        lastTrained: new Date(),
        features: ['historical_revenue', 'pipeline_value', 'seasonality', 'market_trends'],
        status: 'active'
      }
    ];

    defaultModels.forEach(model => this.models.set(model.id, model));
  }

  async predictLeadScore(contactId: string, features: Record<string, any>): Promise<Prediction> {
    const model = this.models.get('lead-scoring-v1');
    if (!model) throw new Error('Lead scoring model not found');

    try {
      // Simulate ML prediction - in production, call actual ML service
      const score = this.calculateLeadScore(features);
      const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence

      const prediction: Prediction = {
        id: crypto.randomUUID(),
        modelId: model.id,
        entityId: contactId,
        entityType: 'contact',
        prediction: score,
        confidence,
        factors: this.getLeadScoringFactors(features, score),
        createdAt: new Date()
      };

      logger.info('Lead score predicted', { contactId, score, confidence });
      return prediction;
    } catch (error) {
      logger.error('Lead scoring prediction failed', { error, contactId });
      throw error;
    }
  }

  async predictDealProbability(dealId: string, features: Record<string, any>): Promise<Prediction> {
    const model = this.models.get('deal-probability-v1');
    if (!model) throw new Error('Deal probability model not found');

    try {
      const probability = this.calculateDealProbability(features);
      const confidence = Math.random() * 0.2 + 0.8; // 80-100% confidence

      const prediction: Prediction = {
        id: crypto.randomUUID(),
        modelId: model.id,
        entityId: dealId,
        entityType: 'deal',
        prediction: probability,
        confidence,
        factors: this.getDealProbabilityFactors(features, probability),
        createdAt: new Date()
      };

      logger.info('Deal probability predicted', { dealId, probability, confidence });
      return prediction;
    } catch (error) {
      logger.error('Deal probability prediction failed', { error, dealId });
      throw error;
    }
  }

  async predictChurnRisk(organizationId: string, features: Record<string, any>): Promise<Prediction> {
    const model = this.models.get('churn-prediction-v1');
    if (!model) throw new Error('Churn prediction model not found');

    try {
      const churnRisk = this.calculateChurnRisk(features);
      const confidence = Math.random() * 0.25 + 0.75; // 75-100% confidence

      const prediction: Prediction = {
        id: crypto.randomUUID(),
        modelId: model.id,
        entityId: organizationId,
        entityType: 'organization',
        prediction: churnRisk,
        confidence,
        factors: this.getChurnRiskFactors(features, churnRisk),
        createdAt: new Date()
      };

      logger.info('Churn risk predicted', { organizationId, churnRisk, confidence });
      return prediction;
    } catch (error) {
      logger.error('Churn prediction failed', { error, organizationId });
      throw error;
    }
  }

  async forecastRevenue(timeframe: number): Promise<Array<{ period: string; predicted: number; confidence: number }>> {
    const model = this.models.get('revenue-forecast-v1');
    if (!model) throw new Error('Revenue forecast model not found');

    try {
      const forecast = [];
      const baseRevenue = 100000; // Starting point
      
      for (let i = 1; i <= timeframe; i++) {
        const growth = 0.05 + (Math.random() - 0.5) * 0.1; // 0-10% growth with variance
        const predicted = baseRevenue * Math.pow(1 + growth, i);
        const confidence = Math.max(0.6, 0.95 - (i * 0.05)); // Decreasing confidence over time
        
        forecast.push({
          period: `Month ${i}`,
          predicted: Math.round(predicted),
          confidence: Math.round(confidence * 100) / 100
        });
      }

      logger.info('Revenue forecast generated', { timeframe, periods: forecast.length });
      return forecast;
    } catch (error) {
      logger.error('Revenue forecasting failed', { error, timeframe });
      throw error;
    }
  }

  private calculateLeadScore(features: Record<string, any>): number {
    let score = 0;
    
    // Email engagement (0-30 points)
    score += Math.min(features.email_engagement || 0, 30);
    
    // Website visits (0-25 points)
    score += Math.min((features.website_visits || 0) * 2, 25);
    
    // Company size (0-20 points)
    const companySizeScore = {
      'enterprise': 20,
      'mid-market': 15,
      'small': 10,
      'startup': 5
    };
    score += companySizeScore[features.company_size] || 0;
    
    // Industry relevance (0-15 points)
    const industryScore = {
      'technology': 15,
      'finance': 12,
      'healthcare': 10,
      'retail': 8
    };
    score += industryScore[features.industry] || 5;
    
    // Job title relevance (0-10 points)
    const titleScore = features.job_title?.toLowerCase().includes('manager') ? 10 : 
                     features.job_title?.toLowerCase().includes('director') ? 8 : 5;
    score += titleScore;

    return Math.min(score, 100);
  }

  private calculateDealProbability(features: Record<string, any>): number {
    let probability = 0.5; // Base 50%
    
    // Deal value impact
    if (features.deal_value > 100000) probability += 0.1;
    else if (features.deal_value < 10000) probability -= 0.1;
    
    // Stage duration impact
    if (features.stage_duration > 30) probability -= 0.15; // Too long in stage
    else if (features.stage_duration < 7) probability += 0.1; // Moving quickly
    
    // Contact engagement
    probability += (features.contact_engagement || 0.5) * 0.2;
    
    // Competitor presence
    if (features.competitor_presence) probability -= 0.1;
    
    return Math.max(0, Math.min(1, probability));
  }

  private calculateChurnRisk(features: Record<string, any>): number {
    let risk = 0;
    
    // Days since last interaction
    const daysSinceInteraction = features.last_interaction || 0;
    if (daysSinceInteraction > 90) risk += 0.4;
    else if (daysSinceInteraction > 30) risk += 0.2;
    
    // Support ticket volume
    const supportTickets = features.support_tickets || 0;
    if (supportTickets > 10) risk += 0.3;
    else if (supportTickets > 5) risk += 0.1;
    
    // Usage frequency decline
    const usageDecline = features.usage_frequency || 0;
    risk += Math.max(0, (1 - usageDecline) * 0.3);
    
    // Satisfaction score
    const satisfaction = features.satisfaction_score || 0.5;
    risk += (1 - satisfaction) * 0.2;
    
    return Math.max(0, Math.min(1, risk));
  }

  private getLeadScoringFactors(features: Record<string, any>, score: number) {
    return [
      {
        feature: 'Email Engagement',
        impact: (features.email_engagement || 0) / 100,
        description: 'Based on email open rates and click-through rates'
      },
      {
        feature: 'Company Size',
        impact: 0.2,
        description: 'Larger companies typically have higher conversion rates'
      },
      {
        feature: 'Industry Fit',
        impact: 0.15,
        description: 'Industry alignment with our target market'
      }
    ];
  }

  private getDealProbabilityFactors(features: Record<string, any>, probability: number) {
    return [
      {
        feature: 'Deal Value',
        impact: features.deal_value > 50000 ? 0.1 : -0.05,
        description: 'Higher value deals have different win rates'
      },
      {
        feature: 'Stage Duration',
        impact: features.stage_duration > 30 ? -0.15 : 0.1,
        description: 'Time spent in current stage affects probability'
      },
      {
        feature: 'Contact Engagement',
        impact: (features.contact_engagement || 0.5) * 0.2,
        description: 'Level of engagement from key contacts'
      }
    ];
  }

  private getChurnRiskFactors(features: Record<string, any>, risk: number) {
    return [
      {
        feature: 'Last Interaction',
        impact: features.last_interaction > 60 ? 0.3 : -0.1,
        description: 'Time since last meaningful interaction'
      },
      {
        feature: 'Support Tickets',
        impact: (features.support_tickets || 0) > 5 ? 0.2 : -0.05,
        description: 'Volume of support requests indicates satisfaction'
      },
      {
        feature: 'Usage Frequency',
        impact: (1 - (features.usage_frequency || 0.5)) * 0.25,
        description: 'Declining usage is a strong churn indicator'
      }
    ];
  }

  getModels(): PredictiveModel[] {
    return Array.from(this.models.values());
  }

  async retrainModel(modelId: string): Promise<boolean> {
    const model = this.models.get(modelId);
    if (!model) return false;

    try {
      model.status = 'training';
      
      // Simulate training time
      setTimeout(() => {
        model.status = 'active';
        model.lastTrained = new Date();
        model.accuracy = Math.random() * 0.1 + 0.8; // 80-90% accuracy
      }, 5000);

      logger.info('Model retraining started', { modelId });
      return true;
    } catch (error) {
      logger.error('Model retraining failed', { error, modelId });
      return false;
    }
  }
}

export const predictiveAnalyticsService = PredictiveAnalyticsService.getInstance();