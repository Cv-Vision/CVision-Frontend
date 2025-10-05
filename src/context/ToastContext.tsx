import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import ToastNotification from '../components/other/ToastNotification';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; id: number } | null>(null);
  const [_toastQueue, setToastQueue] = useState<Array<{ message: string; type: 'success' | 'error' | 'info'; id: number }>>([]);
  const idCounterRef = useRef<number>(0);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    idCounterRef.current += 1;
    const id = idCounterRef.current + Date.now();
    const newToast = { message, type, id };

    setToastQueue((prevQueue) => {
      const updatedQueue = [...prevQueue, newToast];
      if (updatedQueue.length === 1) {
        setToast(newToast);
      }
      return updatedQueue;
    });
  };

  const handleDismiss = () => {
    setToast(null);
    setToastQueue((prevQueue) => {
      const [, ...remainingQueue] = prevQueue;
      if (remainingQueue.length > 0) {
        setToast(remainingQueue[0]);
      }
      return remainingQueue;
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={handleDismiss}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
