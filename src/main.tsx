import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantProvider } from './context/TenantContext';
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
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const user = {
      id: session.user.id,
      email: session.user.email!,
      firstName: session.user.user_metadata?.firstName || 'User',
      lastName: session.user.user_metadata?.lastName || '',
      role: session.user.user_metadata?.role || 'user',
      organizationId: 'default',
      isEmailVerified: session.user.email_confirmed_at !== null,
      twoFactorEnabled: false
    };
    useAuthStore.getState().setUser(user);
  }
};

// Initialize app
const init = async () => {
  await initializeAuth();
  
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <TenantProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </TenantProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    );
  }
};

init().catch(console.error);