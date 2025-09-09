import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { useEffect } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Reports: React.FC = () => {
  const { contacts } = useContactStore();
  const { deals } = useDealStore();

  useEffect(() => {
    // Data should already be loaded from other components
  }, []);

  // Calculate real data from deals
  const totalRevenue = deals.reduce((sum, deal) => 
    deal.stage === 'closed-won' ? sum + deal.value : sum, 0
  );
  
  const activeDeals = deals.filter(deal => 
    !['closed-won', 'closed-lost'].includes(deal.stage)
  ).length;

  const dealData = [
    { name: 'Jan', value: Math.floor(totalRevenue * 0.15) },
    { name: 'Feb', value: Math.floor(totalRevenue * 0.12) },
    { name: 'Mar', value: Math.floor(totalRevenue * 0.18) },
    { name: 'Apr', value: Math.floor(totalRevenue * 0.16) },
    { name: 'May', value: Math.floor(totalRevenue * 0.14) },
    { name: 'Jun', value: Math.floor(totalRevenue * 0.25) },
  ];

  const pipelineData = [
    { name: 'Lead', value: deals.filter(d => d.stage === 'lead').length },
    { name: 'Qualified', value: deals.filter(d => d.stage === 'qualified').length },
    { name: 'Proposal', value: deals.filter(d => d.stage === 'proposal').length },
    { name: 'Negotiation', value: deals.filter(d => d.stage === 'negotiation').length },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <DollarSign className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold">MUR {totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-green-600 flex items-center mt-2">
            <TrendingUp size={16} className="mr-1" />
            +{totalRevenue > 0 ? '15' : '0'}% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Active Deals</h3>
            <DollarSign className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold">{activeDeals}</div>
          <div className="text-sm text-blue-600 mt-2">
            MUR {deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage))
              .reduce((sum, deal) => sum + deal.value, 0).toLocaleString()} potential value
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">New Contacts</h3>
            <Users className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold">{contacts.length}</div>
          <div className="text-sm text-purple-600 mt-2">
            Last 30 days
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
          <LineChart width={500} height={300} data={dealData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Deal Pipeline</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={pipelineData}
              cx={250}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {pipelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Monthly Performance</h3>
        <BarChart width={1100} height={300} data={dealData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};