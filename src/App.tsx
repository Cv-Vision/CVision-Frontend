import { AuthProvider } from './context/AuthContext.tsx';
import { AppRouter } from './router';
import { NavbarComponent } from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <NavbarComponent />
          <main>
            <AppRouter />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 