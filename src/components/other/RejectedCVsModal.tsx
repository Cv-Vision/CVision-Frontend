import React from 'react';
import { Dialog } from '@headlessui/react';

interface RejectedFile {
  name: string;
  reason: string;
}

interface RejectedCVsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectedFiles: RejectedFile[];
  onClear?: () => void;
}

const RejectedCVsModal: React.FC<RejectedCVsModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             rejectedFiles,
                                                             onClear,
                                                           }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-xl z-50">
          <Dialog.Title className="text-lg font-semibold text-red-600 mb-4">
            Archivos rechazados
          </Dialog.Title>

          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {rejectedFiles.map((file, idx) => (
              <li key={idx} className="text-sm text-red-800 flex justify-between">
                <span>{file.name}</span>
                <span className="italic text-red-500">{file.reason}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end gap-4">
            {onClear && (
              <button
                onClick={onClear}
                className="text-sm text-red-500 hover:underline"
              >
                Limpiar lista
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default RejectedCVsModal;
