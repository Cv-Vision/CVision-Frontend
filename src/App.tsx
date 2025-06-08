import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router';
import { Navbar } from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <AppRouter />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 