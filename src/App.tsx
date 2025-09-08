import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Header } from './components/layout/Header';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { supabase } from './config/supabase';

// Lazy load components for code splitting
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const Settings = React.lazy(() => import('./components/settings/Settings').then(module => ({ default: module.Settings })));
const ContactList = React.lazy(() => import('./components/contacts/ContactList').then(module => ({ default: module.ContactList })));
const DealPipeline = React.lazy(() => import('./components/deals/DealPipeline').then(module => ({ default: module.DealPipeline })));
const TaskDashboard = React.lazy(() => import('./components/tasks/TaskDashboard').then(module => ({ default: module.TaskDashboard })));
const InboxView = React.lazy(() => import('./components/communication/InboxView').then(module => ({ default: module.InboxView })));
const TicketDashboard = React.lazy(() => import('./components/tickets/TicketDashboard').then(module => ({ default: module.TicketDashboard })));
const CampaignDashboard = React.lazy(() => import('./components/campaigns/CampaignDashboard').then(module => ({ default: module.CampaignDashboard })));
const FeaturesOverview = React.lazy(() => import('./components/features/FeaturesOverview').then(module => ({ default: module.FeaturesOverview })));
const AnalyticsDashboard = React.lazy(() => import('./components/analytics/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const AutomationSuggestions = React.lazy(() => import('./components/workflow/AutomationSuggestions').then(module => ({ default: module.AutomationSuggestions })));
const OrganizationDashboard = React.lazy(() => import('./components/organization/OrganizationDashboard').then(module => ({ default: module.OrganizationDashboard })));
const Documentation = React.lazy(() => import('./components/docs/Documentation').then(module => ({ default: module.Documentation })));

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Add comprehensive debugging
  React.useEffect(() => {
    console.log('=== APP DEBUG INFO ===');
    console.log('App rendered, isAuthenticated:', isAuthenticated);
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log('Current URL:', window.location.href);
    
    // Test Supabase connection
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('Supabase session:', data.session?.user?.email || 'No session');
      if (error) console.error('Supabase session error:', error);
    });
  }, [isAuthenticated]);

  // Add error boundary
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Global error caught:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-red-500 mb-4">Something went wrong. Check the browser console for details.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      
      <main className={`${isAuthenticated ? 'pt-16' : ''}`}>
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading InsightFusion CRM...</p>
            </div>
          </div>
        }>
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
        </React.Suspense>
      </main>
    </div>
  );
};

export default App;