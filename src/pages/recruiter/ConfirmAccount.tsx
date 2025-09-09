import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CONFIG } from '@/config';
import { useToast } from '../../context/ToastContext'; // Import useToast

const RecruiterConfirmAccount = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast(); // Use the new useToast hook

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const username = searchParams.get('username');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      showToast('Por favor ingresa el código de verificación', 'error'); // Use showToast
      return;
    }

    if (!email) {
      showToast('Email no encontrado en la URL', 'error'); // Use showToast
      return;
    }

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
      showToast('Cuenta confirmada exitosamente. Redirigiendo al login...', 'success'); // Use showToast
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Error confirmando cuenta:', error);
      showToast(error.message || 'Error al confirmar la cuenta', 'error'); // Use showToast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!username) {
      showToast('Username no encontrado en la URL', 'error'); // Use showToast
      return;
    }

    try {
      // Aquí podrías implementar la función para reenviar código
      // usando el username correcto
      showToast('Código reenviado. Revisa tu email.', 'success'); // Use showToast
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Error al reenviar código', 'error'); // Use showToast
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
    </div>
  );
};

export default RecruiterConfirmAccount;