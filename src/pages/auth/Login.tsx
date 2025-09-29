import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useLogin';
import AuthLayout from '@/components/other/AuthLayout';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // navigate is handled inside useLogin
  const { login: doLogin, loading: loginLoading } = useLogin();


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await doLogin(email, password);
  }

  return (
    <AuthLayout title="Iniciar Sesión" subtitle="Accede a tu cuenta">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: "" }));
                }
              }}
              className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                errors.email 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-gray-500"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: "" }));
                }
              }}
              className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                errors.password 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-gray-500"
              }`}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="text-left">
            <Link 
              to="/forgot-password" 
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || loginLoading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 text-base font-medium h-12 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Ingresando...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;