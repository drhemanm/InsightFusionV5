import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

console.log('=== STARTING APP ===');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Current URL:', window.location.href);
console.log('Pathname:', window.location.pathname);

// Use HashRouter as fallback for better compatibility
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found</div>';
} else {
  console.log('Root element found, rendering app...');
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </StrictMode>
  );
}