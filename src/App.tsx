import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseAuthService } from './services/firebase/authService';
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
import { DatabaseAuditPanel } from './components/admin/DatabaseAuditPanel';
import { DatabaseStatus } from './components/admin/DatabaseStatus';
import { DatabaseDiagnostic } from './components/admin/DatabaseDiagnostic';
import { Reports } from './components/reports/Reports';

const App: React.FC = () => {
  const { isAuthenticated, setUser, clearUser, isLoading, setLoading } = useAuthStore();
  
  console.log('App rendering, authenticated:', isAuthenticated);

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        const user = await FirebaseAuthService.getCurrentUser();
        if (user) {
          console.log('✅ Found existing user session:', user.email);
          setUser(user);
        } else {
          console.log('ℹ️ No existing user session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for Firebase auth state changes
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((user) => {
      if (!mounted) return;
      
      if (user) {
        console.log('✅ Firebase user signed in:', user.email);
        setUser(user);
      } else {
        console.log('🚪 Firebase user signed out');
        clearUser();
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [setUser, clearUser, setLoading]);

  // Set up auth state listener separately to avoid dependency issues
  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((user) => {
      if (user) {
        console.log('🔐 Auth state change: User signed in');
        setUser(user);
      } else {
        console.log('🔐 Auth state change: User signed out');
        if (isAuthenticated) {
          clearUser();
        }
      }
    });

    return unsubscribe;
  }, [setUser, clearUser, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
          <p className="text-sm text-gray-500 mt-2">This should only take a few seconds</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
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
          <Route path="/admin/database" element={
            <PrivateRoute>
              <DatabaseAuditPanel />
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
      
      {/* Database Status Indicator */}
      {isAuthenticated && <DatabaseStatus />}
    </div>
  );
};

export default App;