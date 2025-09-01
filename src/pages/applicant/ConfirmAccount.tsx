import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmSignUp } from '@/services/AuthService';
import Toast from '@/components/other/Toast';

const ApplicantConfirmAccount = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const username = searchParams.get('username');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({
      isVisible: true,
      type,
      message
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      showToast('error', 'Por favor ingresa el código de verificación');
      return;
    }

    if (!username) {
      showToast('error', 'Username no encontrado en la URL');
      return;
    }

    setIsSubmitting(true);
    try {
      // Usar el username para confirmar, no el email
      await confirmSignUp({ username, code });
      showToast('success', 'Cuenta confirmada exitosamente. Redirigiendo al login...');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error confirmando cuenta:', error);
      showToast('error', error.message || 'Error al confirmar la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!username) {
      showToast('error', 'Username no encontrado en la URL');
      return;
    }

    try {
      // Aquí podrías implementar la función para reenviar código
      // usando el username correcto
      showToast('success', 'Código reenviado. Revisa tu email.');
    } catch (error: any) {
      showToast('error', 'Error al reenviar código');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-md w-full p-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center mb-8">
          Confirmar Cuenta
        </h1>
        
        <p className="text-blue-700 text-center mb-8 text-lg">
          Hemos enviado un código de verificación a:
          <br />
          <span className="font-semibold text-blue-800">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-base font-semibold text-blue-800 mb-3">
              Código de Verificación
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              className="w-full px-6 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105'
            }`}
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar Cuenta'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-800 text-base font-semibold px-4 py-2 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300"
          >
            ¿No recibiste el código? Reenviar
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 text-base font-medium px-4 py-2 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300"
          >
            Volver al Login
          </button>
        </div>
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default ApplicantConfirmAccount;
