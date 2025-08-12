import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon, TrashIcon, CheckCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

type FileProgressMap = Record<string, number>; // nombre -> porcentaje (100 = ok, -1 = error)

interface Props {
  open: boolean;
  files: File[];
  uploadProgress: FileProgressMap;
  uploading: boolean;
  onClose: () => void;
  onRemove: (index: number) => void;
  onUploadAll: () => Promise<void> | void;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function ModalContent({
                        files, uploadProgress, uploading, onClose, onRemove, onUploadAll
                      }: Omit<Props, 'open'>) {
  const remainingToUpload = files.filter(f => (uploadProgress[f.name] ?? 0) !== 100).length;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      {/* modal centrado */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[92vw] max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200"
      >
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-blue-800">Archivos seleccionados</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            aria-label="Cerrar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-4">
          {files.length === 0 ? (
            <p className="text-gray-600">No hay archivos para mostrar.</p>
          ) : (
            <ul className="divide-y">
              {files.map((file, index) => {
                const prog = uploadProgress[file.name];
                const isDone = prog === 100;
                const isError = prog === -1;
                const isUploading = !isDone && !isError && typeof prog === 'number' && prog > 0;

                return (
                  <li key={`${file.name}-${index}`} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatBytes(file.size)}
                        {isUploading && <span className="ml-2">• Subiendo {prog}%</span>}
                        {isError && <span className="ml-2 text-red-600">• Error al subir</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {isDone && (
                        <span className="inline-flex items-center text-green-600 text-sm font-medium">
                          <CheckCircleIcon className="w-5 h-5 mr-1" /> Subido
                        </span>
                      )}
                      {!isDone && !isUploading && !isError && (
                        <button
                          onClick={() => onRemove(index)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 border border-red-200"
                          title="Eliminar de la lista"
                          disabled={uploading}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Cerrar
          </button>
          <button
            onClick={onUploadAll}
            disabled={uploading || remainingToUpload === 0}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow
              ${uploading || remainingToUpload === 0
              ? 'bg-gray-300 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
            }`}
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            {uploading ? 'Subiendo...' : `Subir ${remainingToUpload} archivo${remainingToUpload !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CVFilesModal(props: Props) {
  const { open } = props;

  // bloquear scroll del fondo mientras el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  if (!open) return null;
  return ReactDOM.createPortal(<ModalContent {...props} />, document.body);
}
