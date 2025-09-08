import React from 'react';
import { Clock, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { format, differenceInHours } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export const TicketAnalytics: React.FC = () => {
  const { tickets } = useTicketStore();

  // Calculate analytics
  const activeTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
  
  const resolutionTimes = tickets
    .filter(t => t.status === 'resolved')
    .map(t => differenceInHours(new Date(t.updatedAt), new Date(t.createdAt)));
  
  const avgResolutionTime = resolutionTimes.length > 0
    ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
    : 0;

  const priorityData = ['low', 'medium', 'high', 'critical'].map(priority => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: tickets.filter(t => t.priority === priority).length
  }));

  const statusData = ['open', 'in_progress', 'resolved', 'closed'].map(status => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: tickets.filter(t => t.status === status).length
  }));

  const categoryData = Object.entries(
    tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Calculate weekly trend data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'MMM dd');
    return {
      date: dateStr,
      tickets: tickets.filter(t => 
        format(new Date(t.createdAt), 'MMM dd') === dateStr
      ).length
    };
  }).reverse();

  const resolutionRate = Math.round(
    (tickets.filter(t => t.status === 'resolved').length / tickets.length) * 100
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Active Tickets</h3>
            <AlertTriangle className="text-yellow-500" size={24} />
          </div>
          <div className="text-3xl font-bold">{activeTickets.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Avg. Resolution Time</h3>
            <Clock className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold">{avgResolutionTime}h</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Resolution Rate</h3>
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold">{resolutionRate}%</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Total Tickets</h3>
            <BarChart2 className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold">{tickets.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Tickets by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {priorityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Tickets by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Weekly Ticket Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tickets" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Top Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};