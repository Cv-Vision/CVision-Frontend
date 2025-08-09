import React, { useState } from 'react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '@/services/AuthService.ts';
import { useAuth } from "@/context/AuthContext.tsx";
import { decodeJwtPayload, CognitoIdTokenPayload } from '@/utils/jwt.ts';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // El rol ahora se deriva del token de Cognito (custom:userType)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cognitoUser = await signIn({ username: email, password });

      const token = cognitoUser?.AuthenticationResult?.IdToken;

      if (!token) {
        throw new Error("No se pudo obtener el token de sesión");
      }

      const payload = decodeJwtPayload<CognitoIdTokenPayload>(token);
      const derivedRole = (payload?.['custom:userType'] as 'candidate' | 'recruiter' | undefined) ?? undefined;

      const userData = { email, role: derivedRole, token };
      if (login) {
        login(userData);
      }

      if (derivedRole === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (derivedRole === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        // Sin rol válido, redirigimos a home o a una página neutra
        navigate('/');
      }
    } catch (err: any) {
      console.error("Error al hacer login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mb-6">
            <ArrowRightOnRectangleIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* El tipo de usuario ahora se infiere desde el token de Cognito */}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Ingresando...
              </div>
            ) : (
              'Ingresar'
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-gray-600 text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
