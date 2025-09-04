import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { JobProvider } from './context/JobContext';
import { ToastProvider } from './context/ToastContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <JobProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </JobProvider>
    </QueryClientProvider>
  </React.StrictMode>
); 