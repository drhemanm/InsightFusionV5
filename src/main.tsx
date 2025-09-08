import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './config/supabase';
import { useAuthStore } from './store/authStore';
import App from './App';
import './index.css';
import './styles/themes.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize auth state from Supabase
const initializeAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth session error:', error);
      return;
    }
    
    if (session?.user) {
      const user = {
        id: session.user.id,
        email: session.user.email!,
        firstName: session.user.user_metadata?.firstName || session.user.user_metadata?.first_name || 'User',
        lastName: session.user.user_metadata?.lastName || session.user.user_metadata?.last_name || '',
        role: session.user.user_metadata?.role || 'user',
        organizationId: 'default',
        isEmailVerified: session.user.email_confirmed_at !== null,
        twoFactorEnabled: false
      };
      useAuthStore.getState().setUser(user);
      console.log('User initialized:', user.email);
    }
  } catch (error) {
    console.error('Failed to initialize auth:', error);
  }
};

// Initialize app
const init = async () => {
  try {
    console.log('Initializing app...');
    await initializeAuth();
    console.log('Auth initialized');
  } catch (error) {
    console.error('App initialization failed:', error);
  }
  
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
};

init().catch(console.error);