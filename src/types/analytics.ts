export interface PredictiveModel {
  id: string;
  name: string;
  type: 'lead_scoring' | 'deal_probability' | 'churn_prediction' | 'revenue_forecast';
  accuracy: number;
  lastTrained: Date;
  features: string[];
  status: 'active' | 'training' | 'inactive';
}

export interface Prediction {
  id: string;
  modelId: string;
  entityId: string;
  entityType: 'contact' | 'deal' | 'organization';
  prediction: number;
  confidence: number;
  factors: Array<{
    feature: string;
    impact: number;
    description: string;
  }>;
  createdAt: Date;
}

export interface ReportConfig {
  id: string;
  name: string;
  description?: string;
  type: 'table' | 'chart' | 'dashboard';
  dataSource: string;
  filters: ReportFilter[];
  groupBy: string[];
  metrics: ReportMetric[];
  visualization: VisualizationConfig;
  schedule?: ScheduleConfig;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between' | 'in';
  value: any;
  label?: string;
}

export interface ReportMetric {
  field: string;
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct_count';
  label: string;
  format?: 'currency' | 'percentage' | 'number' | 'date';
}

export interface VisualizationConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'funnel' | 'gauge';
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  title?: string;
  subtitle?: string;
}

export interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data: any;
  recommendations: string[];
  createdAt: Date;
}