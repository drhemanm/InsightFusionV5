import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantProvider } from './context/TenantContext';
import { ThemeProvider } from './context/ThemeContext';
import { firebaseService } from './services/firebase/FirebaseService';
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

// Initialize app
const init = async () => {
  // Initialize Firebase first
  await firebaseService.initialize();
  
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