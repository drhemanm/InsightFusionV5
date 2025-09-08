import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Header } from './components/layout/Header';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { PrivateRoute } from './components/auth/PrivateRoute';

// Import components directly instead of lazy loading to avoid module loading issues
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings } from './components/settings/Settings';
import { ContactList } from './components/contacts/ContactList';
import { DealPipeline } from './components/deals/DealPipeline';
import { TaskDashboard } from './components/tasks/TaskDashboard';
import { InboxView } from './components/communication/InboxView';
import { TicketDashboard } from './components/tickets/TicketDashboard';
import { CampaignDashboard } from './components/campaigns/CampaignDashboard';
import { FeaturesOverview } from './components/features/FeaturesOverview';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AutomationSuggestions } from './components/workflow/AutomationSuggestions';
import { OrganizationDashboard } from './components/organization/OrganizationDashboard';
import { Documentation } from './components/docs/Documentation';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  console.log('App rendering, authenticated:', isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      
      <main className={`${isAuthenticated ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/contacts" element={
            <PrivateRoute>
              <ContactList />
            </PrivateRoute>
          } />
          <Route path="/deals" element={
            <PrivateRoute>
              <DealPipeline />
            </PrivateRoute>
          } />
          <Route path="/tickets" element={
            <PrivateRoute>
              <TicketDashboard />
            </PrivateRoute>
          } />
          <Route path="/campaigns" element={
            <PrivateRoute>
              <CampaignDashboard />
            </PrivateRoute>
          } />
          <Route path="/tasks" element={
            <PrivateRoute>
              <TaskDashboard />
            </PrivateRoute>
          } />
          <Route path="/messages" element={
            <PrivateRoute>
              <InboxView />
            </PrivateRoute>
          } />
          <Route path="/organization" element={
            <PrivateRoute>
              <OrganizationDashboard />
            </PrivateRoute>
          } />
          <Route path="/docs" element={
            <PrivateRoute>
              <Documentation />
            </PrivateRoute>
          } />
          <Route path="/features" element={
            <PrivateRoute>
              <FeaturesOverview />
            </PrivateRoute>
          } />
          <Route path="/analytics" element={
            <PrivateRoute>
              <AnalyticsDashboard />
            </PrivateRoute>
          } />
          <Route path="/automation" element={
            <PrivateRoute>
              <AutomationSuggestions context={{ screen: 'automation' }} />
            </PrivateRoute>
          } />
          <Route path="/settings/*" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;