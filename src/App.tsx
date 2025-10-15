import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Header } from './components/layout/Header';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { LandingPage } from './components/auth/LandingPage';
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
import { AutomationDashboard } from './components/automation/AutomationDashboard';
import { OrganizationDashboard } from './components/organization/OrganizationDashboard';
import { Documentation } from './components/docs/Documentation';
import { GamificationAdminPanel } from './components/gamification/admin/GamificationAdminPanel';
import { DatabaseDiagnostic } from './components/admin/DatabaseDiagnostic';
import { Reports } from './components/reports/Reports';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  
  console.log('App rendering, authenticated:', isAuthenticated);

  // Initialize auth state on mount
  useEffect(() => {
    console.log('🔄 Initializing Supabase auth...');
    initialize();
  }, [initialize]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-500 to-dark-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
          <p className="text-sm text-gray-500 mt-2">This should only take a few seconds</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-300 to-dark-100">
      {isAuthenticated && <Header />}
      
      <main className={`${isAuthenticated ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
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
              <AutomationDashboard />
            </PrivateRoute>
          } />
          <Route path="/gamification/admin" element={
            <PrivateRoute>
              <GamificationAdminPanel />
            </PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          } />
          <Route path="/settings/*" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          <Route path="/admin/diagnostic" element={
            <PrivateRoute>
              <DatabaseDiagnostic />
            </PrivateRoute>
          } />
          
          {/* Catch-all route for 404s */}
          <Route path="*" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
