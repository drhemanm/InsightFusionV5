import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { predictiveAnalyticsService } from '../../services/analytics/PredictiveAnalyticsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { PredictiveModel, Prediction } from '../../types/analytics';

export const PredictiveAnalytics: React.FC = () => {
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [revenueForcast, setRevenueForcast] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const modelsList = predictiveAnalyticsService.getModels();
      setModels(modelsList);

      // Generate sample predictions
      const samplePredictions = await Promise.all([
        predictiveAnalyticsService.predictLeadScore('contact-1', {
          email_engagement: 85,
          website_visits: 12,
          company_size: 'enterprise',
          industry: 'technology',
          job_title: 'VP Sales'
        }),
        predictiveAnalyticsService.predictDealProbability('deal-1', {
          deal_value: 75000,
          stage_duration: 15,
          contact_engagement: 0.8,
          competitor_presence: false
        })
      ]);
      setPredictions(samplePredictions);

      // Generate revenue forecast
      const forecast = await predictiveAnalyticsService.forecastRevenue(6);
      setRevenueForcast(forecast);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrainModel = async (modelId: string) => {
    try {
      await predictiveAnalyticsService.retrainModel(modelId);
      loadAnalytics(); // Refresh data
    } catch (error) {
      console.error('Failed to retrain model:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Predictive Analytics</h1>
          <p className="text-gray-600">AI-powered insights and forecasting</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
          <Brain size={16} />
          AI Powered
        </div>
      </div>

      {/* Model Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {model.type === 'lead_scoring' && <Target className="text-blue-500" size={20} />}
                {model.type === 'deal_probability' && <TrendingUp className="text-green-500" size={20} />}
                {model.type === 'churn_prediction' && <AlertTriangle className="text-red-500" size={20} />}
                {model.type === 'revenue_forecast' && <Zap className="text-purple-500" size={20} />}
                <h3 className="font-medium">{model.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                model.status === 'active' ? 'bg-green-100 text-green-800' :
                model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {model.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">{Math.round(model.accuracy * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Trained:</span>
                <span className="font-medium">{model.lastTrained.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Features:</span>
                <span className="font-medium">{model.features.length}</span>
              </div>
            </div>

            <button
              onClick={() => handleRetrainModel(model.id)}
              disabled={model.status === 'training'}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              {model.status === 'training' ? 'Training...' : 'Retrain Model'}
            </button>
          </div>
        ))}
      </div>

      {/* Revenue Forecast */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Revenue Forecast</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueForcast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`MUR ${value.toLocaleString()}`, 'Predicted Revenue']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                name="Predicted Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Recent Predictions</h2>
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="text-purple-500" size={20} />
                    <span className="font-medium">
                      {prediction.entityType.charAt(0).toUpperCase() + prediction.entityType.slice(1)} Prediction
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {Math.round(prediction.prediction * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Factors:</h4>
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{factor.feature}:</span>
                      <span className={`font-medium ${
                        factor.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Model Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={models.map(model => ({
                name: model.name.split(' ')[0],
                accuracy: Math.round(model.accuracy * 100)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Accuracy']} />
                <Bar dataKey="accuracy" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Brain size={24} />
          <h2 className="text-xl font-bold">AI Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium mb-2">Top Opportunity</h3>
            <p className="text-sm opacity-90">
              Focus on enterprise leads in technology sector - 23% higher conversion rate
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium mb-2">Risk Alert</h3>
            <p className="text-sm opacity-90">
              3 high-value customers showing churn risk signals - immediate action recommended
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium mb-2">Forecast Update</h3>
            <p className="text-sm opacity-90">
              Q2 revenue forecast updated: 15% increase likely based on current pipeline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};