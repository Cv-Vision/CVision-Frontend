import React, { useState } from 'react';
import { useGuestComplete } from '@/hooks/useGuestComplete';
import { useToast } from '@/context/ToastContext';
import { Mail, RefreshCw } from 'lucide-react';

interface GuestResendLinkProps {
  email: string;
  onClose: () => void;
}

export default function GuestResendLink({ email, onClose }: GuestResendLinkProps) {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { resendGuestLink } = useGuestComplete();
  const { showToast } = useToast();

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendGuestLink(email);
      if (result.success) {
        setResent(true);
        showToast('Enlace reenviado exitosamente', 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Error al reenviar enlace', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col gap-6">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿No recibiste el email?
          </h2>
          <p className="text-gray-600">
            Te podemos reenviar el enlace para completar tu perfil
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Email:</p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        {resent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-center">
            <p className="font-medium">¡Enlace reenviado!</p>
            <p className="text-sm">Revisa tu correo electrónico</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleResend}
            disabled={isResending || resent}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Reenviar
              </>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Si no ves el email, revisa tu carpeta de spam o promociones
          </p>
        </div>
      </div>
    </div>
  );
}
