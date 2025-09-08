import { logger } from '../../utils/monitoring/logger';
import type { ReportConfig, ChartData, ReportFilter, ReportMetric } from '../../types/analytics';

class ReportBuilderService {
  private static instance: ReportBuilderService;
  private reports: Map<string, ReportConfig> = new Map();

  private constructor() {}

  static getInstance(): ReportBuilderService {
    if (!ReportBuilderService.instance) {
      ReportBuilderService.instance = new ReportBuilderService();
    }
    return ReportBuilderService.instance;
  }

  async createReport(config: Omit<ReportConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReportConfig> {
    try {
      const report: ReportConfig = {
        ...config,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.reports.set(report.id, report);
      logger.info('Report created', { reportId: report.id, name: report.name });
      return report;
    } catch (error) {
      logger.error('Failed to create report', { error });
      throw error;
    }
  }

  async updateReport(id: string, updates: Partial<ReportConfig>): Promise<ReportConfig> {
    const report = this.reports.get(id);
    if (!report) throw new Error('Report not found');

    try {
      const updatedReport = {
        ...report,
        ...updates,
        updatedAt: new Date()
      };

      this.reports.set(id, updatedReport);
      logger.info('Report updated', { reportId: id });
      return updatedReport;
    } catch (error) {
      logger.error('Failed to update report', { error, reportId: id });
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    if (!this.reports.has(id)) throw new Error('Report not found');

    try {
      this.reports.delete(id);
      logger.info('Report deleted', { reportId: id });
    } catch (error) {
      logger.error('Failed to delete report', { error, reportId: id });
      throw error;
    }
  }

  async executeReport(id: string): Promise<ChartData> {
    const report = this.reports.get(id);
    if (!report) throw new Error('Report not found');

    try {
      const data = await this.fetchReportData(report);
      const processedData = this.processReportData(data, report);
      const chartData = this.formatChartData(processedData, report);

      logger.info('Report executed', { reportId: id, dataPoints: chartData.labels.length });
      return chartData;
    } catch (error) {
      logger.error('Failed to execute report', { error, reportId: id });
      throw error;
    }
  }

  private async fetchReportData(report: ReportConfig): Promise<any[]> {
    // In production, this would fetch from your actual data source
    // For now, we'll generate mock data based on the report configuration
    
    const mockData = this.generateMockData(report.dataSource, report.filters);
    return mockData;
  }

  private generateMockData(dataSource: string, filters: ReportFilter[]): any[] {
    const baseData: Record<string, any[]> = {
      deals: [
        { id: '1', value: 50000, stage: 'qualified', created_date: '2024-01-15', assigned_to: 'user1' },
        { id: '2', value: 75000, stage: 'proposal', created_date: '2024-01-20', assigned_to: 'user2' },
        { id: '3', value: 25000, stage: 'negotiation', created_date: '2024-02-01', assigned_to: 'user1' },
        { id: '4', value: 100000, stage: 'closed-won', created_date: '2024-02-15', assigned_to: 'user3' },
        { id: '5', value: 30000, stage: 'closed-lost', created_date: '2024-03-01', assigned_to: 'user2' }
      ],
      contacts: [
        { id: '1', created_date: '2024-01-10', source: 'website', status: 'active' },
        { id: '2', created_date: '2024-01-25', source: 'referral', status: 'active' },
        { id: '3', created_date: '2024-02-05', source: 'social', status: 'inactive' },
        { id: '4', created_date: '2024-02-20', source: 'website', status: 'active' }
      ],
      activities: [
        { id: '1', type: 'email', date: '2024-01-15', user_id: 'user1' },
        { id: '2', type: 'call', date: '2024-01-16', user_id: 'user2' },
        { id: '3', type: 'meeting', date: '2024-01-18', user_id: 'user1' },
        { id: '4', type: 'email', date: '2024-01-20', user_id: 'user3' }
      ]
    };

    let data = baseData[dataSource] || [];

    // Apply filters
    filters.forEach(filter => {
      data = data.filter(item => this.applyFilter(item, filter));
    });

    return data;
  }

  private applyFilter(item: any, filter: ReportFilter): boolean {
    const value = item[filter.field];
    
    switch (filter.operator) {
      case 'equals':
        return value === filter.value;
      case 'not_equals':
        return value !== filter.value;
      case 'greater_than':
        return value > filter.value;
      case 'less_than':
        return value < filter.value;
      case 'contains':
        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
      case 'between':
        return value >= filter.value[0] && value <= filter.value[1];
      case 'in':
        return Array.isArray(filter.value) && filter.value.includes(value);
      default:
        return true;
    }
  }

  private processReportData(data: any[], report: ReportConfig): any {
    const { groupBy, metrics } = report;
    
    if (groupBy.length === 0) {
      // No grouping, just aggregate all data
      return this.aggregateData(data, metrics);
    }

    // Group data by specified fields
    const grouped = data.reduce((acc, item) => {
      const key = groupBy.map(field => item[field]).join('|');
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    // Aggregate each group
    const result = Object.entries(grouped).map(([key, items]) => {
      const groupValues = key.split('|');
      const aggregated = this.aggregateData(items, metrics);
      
      const result: any = {};
      groupBy.forEach((field, index) => {
        result[field] = groupValues[index];
      });
      
      metrics.forEach(metric => {
        result[metric.label] = aggregated[metric.label];
      });
      
      return result;
    });

    return result;
  }

  private aggregateData(data: any[], metrics: ReportMetric[]): any {
    const result: any = {};
    
    metrics.forEach(metric => {
      const values = data.map(item => item[metric.field]).filter(v => v != null);
      
      switch (metric.aggregation) {
        case 'sum':
          result[metric.label] = values.reduce((sum, val) => sum + Number(val), 0);
          break;
        case 'count':
          result[metric.label] = values.length;
          break;
        case 'avg':
          result[metric.label] = values.length > 0 ? 
            values.reduce((sum, val) => sum + Number(val), 0) / values.length : 0;
          break;
        case 'min':
          result[metric.label] = values.length > 0 ? Math.min(...values.map(Number)) : 0;
          break;
        case 'max':
          result[metric.label] = values.length > 0 ? Math.max(...values.map(Number)) : 0;
          break;
        case 'distinct_count':
          result[metric.label] = new Set(values).size;
          break;
      }
    });
    
    return result;
  }

  private formatChartData(data: any, report: ReportConfig): ChartData {
    if (Array.isArray(data)) {
      // Grouped data
      const labels = data.map(item => {
        if (report.groupBy.length === 1) {
          return String(item[report.groupBy[0]]);
        }
        return report.groupBy.map(field => item[field]).join(' - ');
      });

      const datasets = report.metrics.map((metric, index) => ({
        label: metric.label,
        data: data.map(item => item[metric.label] || 0),
        backgroundColor: this.getColor(index),
        borderColor: this.getColor(index),
        borderWidth: 2
      }));

      return { labels, datasets };
    } else {
      // Single aggregated result
      const labels = report.metrics.map(metric => metric.label);
      const values = report.metrics.map(metric => data[metric.label] || 0);

      return {
        labels,
        datasets: [{
          label: 'Values',
          data: values,
          backgroundColor: labels.map((_, index) => this.getColor(index)),
          borderWidth: 1
        }]
      };
    }
  }

  private getColor(index: number): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    return colors[index % colors.length];
  }

  getReports(): ReportConfig[] {
    return Array.from(this.reports.values());
  }

  async getReportById(id: string): Promise<ReportConfig | null> {
    return this.reports.get(id) || null;
  }

  getAvailableDataSources(): Array<{ id: string; name: string; fields: string[] }> {
    return [
      {
        id: 'deals',
        name: 'Deals',
        fields: ['id', 'value', 'stage', 'created_date', 'assigned_to', 'expected_close_date']
      },
      {
        id: 'contacts',
        name: 'Contacts',
        fields: ['id', 'created_date', 'source', 'status', 'last_interaction']
      },
      {
        id: 'activities',
        name: 'Activities',
        fields: ['id', 'type', 'date', 'user_id', 'duration']
      },
      {
        id: 'campaigns',
        name: 'Campaigns',
        fields: ['id', 'name', 'type', 'budget', 'start_date', 'end_date', 'status']
      }
    ];
  }
}

export const reportBuilderService = ReportBuilderService.getInstance();