import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signIn } from '@/services/AuthService.ts';
import { decodeJwt, useAuth } from "@/context/AuthContext.tsx";
import { useToast } from '@/context/ToastContext';
import { UserRole } from '@/types/auth.ts';
import AuthLayout from '@/components/other/AuthLayout';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const fromJobListings = searchParams.get('fromJobListings') === 'true';

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

    setLoading(true);

    try {
      const cognitoUser = await signIn({ username: email, password });
      const token = cognitoUser?.AuthenticationResult?.IdToken;

      if (!token) {
        throw new Error("No se pudo obtener el token de sesión");
      }

      const decodedToken = decodeJwt(token);
      const userType = decodedToken ? decodedToken['custom:userType'] : null;

      if (!userType || (userType !== 'RECRUITER' && userType !== 'APPLICANT')) {
        throw new Error("Tipo de usuario no válido o no encontrado en el token.");
      }

      const role: UserRole = (userType === 'RECRUITER') ? 'recruiter' : 'applicant';
      const userData = { email, role, token };

      if (login) {
        login(userData);
      }

      // Verificar si hay una URL de redirección guardada
      const redirectUrl = localStorage.getItem('redirectAfterAuth');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirectUrl);
      } else {
        if (role === 'applicant') {
          navigate('/applicant/dashboard', { state: { justLoggedIn: true, userName: decodedToken?.name || email.split('@')[0] } });
        } else {
          navigate('/recruiter/dashboard');
        }
      }
    } catch (err: any) {
      console.error("Error al hacer login:", err);
      showToast(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
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
              className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.email 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-teal-500"
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
              className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                errors.password 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-teal-500"
              }`}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="text-left">
            <Link 
              to="/forgot-password" 
              className="text-sm text-teal-600 hover:text-teal-800 hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 text-base font-medium h-12 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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