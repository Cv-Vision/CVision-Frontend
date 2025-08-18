import React from 'react';
import { XMarkIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';

interface SelectedFilesModalProps {
  files: File[];
  onClose: () => void;
  onRemove: (index: number) => void;
  onRemoveAll: () => void;
  uploading: boolean;
  uploadProgress: Record<string, number>;
}

const SelectedFilesModal: React.FC<SelectedFilesModalProps> = ({ files, onClose, onRemove, onRemoveAll, uploading, uploadProgress }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <XMarkIcon className="h-7 w-7" />
        </button>
        <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center justify-between">
          Archivos seleccionados
          <button
            onClick={onRemoveAll}
            className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all text-sm font-medium"
            type="button"
            disabled={uploading}
          >
            Borrar todos
          </button>
        </h3>
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No hay archivos seleccionados.</div>
          ) : (
            files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
                    <DocumentArrowUpIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  {uploadProgress[file.name] === 100 && (
                    <div className="p-1 rounded-full bg-green-100">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                  )}
                  {uploadProgress[file.name] === -1 && (
                    <div className="p-1 rounded-full bg-red-100">
                      <span className="text-red-600 text-sm font-bold">✗</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                  disabled={uploading}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedFilesModal;


