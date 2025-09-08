import React, { useState, useEffect } from 'react';
import { Plus, Play, Save, Download, BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react';
import { reportBuilderService } from '../../services/analytics/ReportBuilderService';
import { ReportPreview } from './ReportPreview';
import { FilterBuilder } from './FilterBuilder';
import { MetricBuilder } from './MetricBuilder';
import { VisualizationSelector } from './VisualizationSelector';
import type { ReportConfig, ReportFilter, ReportMetric, VisualizationConfig } from '../../types/analytics';

export const ReportBuilder: React.FC = () => {
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dataSource: '',
    filters: [] as ReportFilter[],
    groupBy: [] as string[],
    metrics: [] as ReportMetric[],
    visualization: {
      type: 'bar',
      showLegend: true,
      showGrid: true
    } as VisualizationConfig
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const reportsList = reportBuilderService.getReports();
      setReports(reportsList);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const handleCreateReport = async () => {
    try {
      const report = await reportBuilderService.createReport({
        ...formData,
        type: 'chart',
        createdBy: 'current-user'
      });
      
      setReports([...reports, report]);
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  const handlePreviewReport = async () => {
    try {
      // Create temporary report for preview
      const tempReport: ReportConfig = {
        ...formData,
        id: 'temp',
        type: 'chart',
        createdBy: 'current-user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const data = await reportBuilderService.executeReport(tempReport.id);
      setPreviewData(data);
    } catch (error) {
      console.error('Failed to preview report:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dataSource: '',
      filters: [],
      groupBy: [],
      metrics: [],
      visualization: {
        type: 'bar',
        showLegend: true,
        showGrid: true
      }
    });
    setPreviewData(null);
  };

  const dataSources = reportBuilderService.getAvailableDataSources();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Report Builder</h1>
          <p className="text-gray-600">Create custom reports and visualizations</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          New Report
        </button>
      </div>

      {isCreating ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Configuration */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Report Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Report Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter report name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what this report shows"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Data Source</label>
                  <select
                    value={formData.dataSource}
                    onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select data source</option>
                    {dataSources.map(source => (
                      <option key={source.id} value={source.id}>{source.name}</option>
                    ))}
                  </select>
                </div>

                {formData.dataSource && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Group By</label>
                    <select
                      multiple
                      value={formData.groupBy}
                      onChange={(e) => setFormData({
                        ...formData,
                        groupBy: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      size={4}
                    >
                      {dataSources.find(s => s.id === formData.dataSource)?.fields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <FilterBuilder
              filters={formData.filters}
              dataSource={formData.dataSource}
              onChange={(filters) => setFormData({ ...formData, filters })}
            />

            <MetricBuilder
              metrics={formData.metrics}
              dataSource={formData.dataSource}
              onChange={(metrics) => setFormData({ ...formData, metrics })}
            />

            <VisualizationSelector
              config={formData.visualization}
              onChange={(visualization) => setFormData({ ...formData, visualization })}
            />

            <div className="flex gap-4">
              <button
                onClick={handlePreviewReport}
                disabled={!formData.dataSource || formData.metrics.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Play size={20} />
                Preview
              </button>
              <button
                onClick={handleCreateReport}
                disabled={!formData.name || !formData.dataSource || formData.metrics.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={20} />
                Save Report
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Preview</h2>
            {previewData ? (
              <ReportPreview
                data={previewData}
                config={formData.visualization}
                title={formData.name || 'Untitled Report'}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>Configure your report and click Preview to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Existing Reports */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {report.visualization.type === 'bar' && <BarChart3 className="text-blue-500" size={20} />}
                  {report.visualization.type === 'pie' && <PieChart className="text-green-500" size={20} />}
                  {report.visualization.type === 'line' && <LineChart className="text-purple-500" size={20} />}
                  <h3 className="font-medium">{report.name}</h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Download size={16} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">{report.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Data: {report.dataSource}</span>
                <span>{report.updatedAt.toLocaleDateString()}</span>
              </div>

              <button
                onClick={() => setSelectedReport(report)}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                View Report
              </button>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="col-span-full text-center py-12">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
              <p className="text-gray-600 mb-4">Create your first custom report to get started</p>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Report
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};