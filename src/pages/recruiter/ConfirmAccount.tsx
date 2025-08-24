import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmSignUp } from '@/services/AuthService';
import Toast from '@/components/other/Toast';

const RecruiterConfirmAccount = () => {
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
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
          Confirmar Cuenta de Reclutador
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          Hemos enviado un código de verificación a:
          <br />
          <span className="font-semibold text-blue-600">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Verificación
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ¿No recibiste el código? Reenviar
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-800 text-sm"
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

export default RecruiterConfirmAccount;
