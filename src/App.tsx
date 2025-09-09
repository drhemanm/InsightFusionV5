import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './config/supabase';
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
import { AutomationSuggestions } from './components/workflow/AutomationSuggestions';
import { OrganizationDashboard } from './components/organization/OrganizationDashboard';
import { Documentation } from './components/docs/Documentation';
import { DatabaseAuditPanel } from './components/admin/DatabaseAuditPanel';
import { DatabaseStatus } from './components/admin/DatabaseStatus';

const App: React.FC = () => {
  const { isAuthenticated, setUser, clearUser, isLoading, setLoading } = useAuthStore();
  
  console.log('App rendering, authenticated:', isAuthenticated);

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Check for existing session on app load
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Auth initialization timeout, setting loading to false');
            setLoading(false);
          }
        }, 10000); // 10 second timeout

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email);
          const user = {
            id: session.user.id,
            email: session.user.email!,
            firstName: session.user.user_metadata?.first_name || 
                      session.user.user_metadata?.firstName || 
                      session.user.user_metadata?.given_name ||
                      session.user.user_metadata?.name?.split(' ')[0] ||
                      session.user.email?.split('@')[0] || 'User',
            lastName: session.user.user_metadata?.last_name || 
                     session.user.user_metadata?.lastName || 
                     session.user.user_metadata?.family_name ||
                     session.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
            role: 'user' as const,
            organizationId: 'default',
            isEmailVerified: session.user.email_confirmed_at !== null,
            twoFactorEnabled: false
          };
          setUser(user);
        } else {
          console.log('ℹ️ No existing session found');
          setLoading(false);
        }
        
        // Clear timeout if we got here successfully
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔐 Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in:', session.user.email);
          console.log('👤 User metadata:', session.user.user_metadata);
          
          const user = {
            id: session.user.id,
            email: session.user.email!,
            firstName: session.user.user_metadata?.first_name || 
                      session.user.user_metadata?.firstName || 
                      session.user.user_metadata?.given_name ||
                      session.user.user_metadata?.name?.split(' ')[0] ||
                      session.user.email?.split('@')[0] || 'User',
            lastName: session.user.user_metadata?.last_name || 
                     session.user.user_metadata?.lastName || 
                     session.user.user_metadata?.family_name ||
                     session.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
            role: 'user' as const,
            organizationId: 'default',
            isEmailVerified: session.user.email_confirmed_at !== null,
            twoFactorEnabled: false
          };
          
          console.log('🔄 Setting user in store:', user);
          setUser(user);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          clearUser();
        } else if (event === 'INITIAL_SESSION') {
          console.log('🔄 Initial session check completed');
          // If no session found, stop loading
          if (!session) {
            setLoading(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
        } else {
          console.log('ℹ️ Auth event:', event);
        }
      }
    );

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

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
              <AutomationSuggestions context={{ screen: 'automation' }} />
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
        </Routes>
      </main>
      
      {/* Database Status Indicator */}
      {isAuthenticated && <DatabaseStatus />}
    </div>
  );
};

export default App;