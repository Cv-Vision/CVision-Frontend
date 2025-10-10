import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGuestComplete, GuestTokenStatus } from '@/hooks/useGuestComplete';
import { useToast } from '@/context/ToastContext';
import AuthLayout from '@/components/other/AuthLayout';
import { User, Phone, Eye, EyeOff } from 'lucide-react';

const GuestCompleteAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { validateToken, completeProfile, isLoading, error } = useGuestComplete();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tokenIsValid, setTokenIsValid] = useState<boolean | null>(null);
  const [tokenData, setTokenData] = useState<GuestTokenStatus | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const result = await validateToken(token);
        setTokenIsValid(result.valid);
        setTokenData(result);
      } else {
        showToast('Token no encontrado en la URL', 'error');
        navigate('/');
      }
    };

    checkToken();
  }, [token]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.phone.trim()) {
      const phone = formData.phone.trim();
      if (!/^[0-9]+$/.test(phone) || phone.length < 8 || phone.length > 15) {
        newErrors.phone = 'El teléfono debe tener entre 8 y 15 dígitos y solo puede contener números';
      }
    }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await completeProfile({
        token: token!,
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        password: formData.password
      });

      if (result.success) {
        showToast('¡Cuenta creada exitosamente! Redirigiendo a validar cuenta...', 'success');
        setTimeout(() => {
          const email = result.email;
          const username = formData.name;
          navigate(`/applicant-confirm?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading && tokenIsValid === null) {
    return (
      <AuthLayout title="Validando enlace..." subtitle="">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    );
  }

  // Cuando la validación del token falla...
  if (tokenIsValid === false) {
    return (
      <AuthLayout title="Enlace inválido o expirado" subtitle="">
        <div className="mt-8 mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-lg font-semibold mb-4">
            El enlace ya fue usado, expiró o no es válido.<br />
            Si necesitas reintentarlo, solicita un nuevo acceso.
          </p>
          <button
            className="mt-2 py-2 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="¡Gracias por tu aplicación!" subtitle="Crea tu cuenta para seguir tus postulaciones y recibir novedades.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="text-sm block mb-2 font-medium">
            Nombre Completo *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu nombre completo"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="text-sm block mb-2 font-medium">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
              maxLength={15}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>



        {/* Contraseñas obligatorias */}
        <div className="border-t pt-4">
          <div className="space-y-4">
            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="text-sm block mb-2 font-normal">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-blue-500'}`}
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Crea una contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (<p className="text-sm text-red-500 mt-1">{errors.password}</p>)}
            </div>
            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm block mb-2 font-normal">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-blue-500'}`}
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (<p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>)}
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Completando...' : 'Completar Perfil'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-center">
            {error}
          </div>
        )}
      </form>

      <div className="text-center text-sm text-gray-500">
        <p>
          Al completar tu perfil, aceptas nuestros{' '}
          <a href="#" className="text-blue-500 hover:underline">términos de servicio</a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default GuestCompleteAccount;
