import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CONFIG } from '@/config';
import { useToast } from '../../context/ToastContext';
import AuthLayout from '@/components/other/AuthLayout';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

const ApplicantConfirmAccount = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const username = searchParams.get('username');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = 'El código de verificación es requerido';
    } else if (code.length !== 6) {
      newErrors.code = 'El código debe tener 6 dígitos';
    }

    if (!email) {
      newErrors.email = 'Email no encontrado en la URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Llamar a backend para confirmar cuenta
      const response = await fetch(`${CONFIG.apiUrl}/auth/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, 'confirmation_code': code, 'name': username }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al confirmar la cuenta');
      }
      showToast('Cuenta confirmada exitosamente. Redirigiendo al login...', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Error confirmando cuenta:', error);
      showToast(error.message || 'Error al confirmar la cuenta', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!username) {
      showToast('Username no encontrado en la URL', 'error');
      return;
    }

    setIsResending(true);
    try {
      // Aquí podrías implementar la función para reenviar código
      // usando el username correcto
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      showToast('Código reenviado. Revisa tu email.', 'success');
    } catch (error: any) {
      showToast('Error al reenviar código', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout title="Confirmar Cuenta" subtitle="Verifica tu dirección de email">
      <div className="space-y-6">
        {/* Email confirmation info */}
        <div className="border-gray-200 border rounded-lg p-6 bg-gray-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Código enviado</h3>
              <p className="text-sm text-gray-600">Hemos enviado un código de verificación a:</p>
            </div>
          </div>
          <p className="font-medium text-gray-800 text-center">{email}</p>
        </div>

        {/* Verification form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-foreground">
              Código de Verificación <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errors.code) {
                  setErrors(prev => ({ ...prev, code: "" }));
                }
              }}
              placeholder="Ingresa el código de 6 dígitos"
              className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                errors.code 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-gray-500"
              }`}
              maxLength={6}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 text-base font-medium h-12 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar Cuenta'}
          </button>
        </form>

        {/* Resend code */}
        <div className="text-center">
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
          </button>
        </div>

        {/* Back to login */}
        <div className="text-center pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gray-600 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ApplicantConfirmAccount;
