import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ToastNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      onClose();
    }, 5200);
    return () => clearTimeout(t);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-6 sm:pt-8 md:pt-10 pointer-events-none">
      <div
        className={`
          pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl
          flex items-center gap-3
          text-base font-semibold
          animate-fade-in-out
          ${type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-blue-50 border border-blue-200 text-blue-800'}
        `}
        style={{ minWidth: 280, maxWidth: '90vw' }}
        role="alert"
      >
        <span>
          {type === 'success' ? (
            <svg className="w-5 h-5 text-green-600 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : type === 'error' ? (
            <svg className="w-5 h-5 text-red-600 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </span>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-lg text-gray-400 hover:text-gray-700 transition"
          aria-label="Cerrar notificación"
        >
          &times;
        </button>
      </div>
    </div>
  , document.body);
};

export default ToastNotification;