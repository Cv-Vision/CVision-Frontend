import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';
import RejectedCVsModal from './RejectedCVsModal.tsx';
import CVFilesModal from './CVFilesModal.tsx';
import { useCVValidation } from '@/hooks/useCVValidation.ts';
import JSZip from 'jszip';
import { useFileUploader } from '@/hooks/useFileUploader.ts';

interface CVDropzoneProps {
  jobId: string;
  onUploadComplete?: (fileUrls: string[]) => void;
  onError?: (error: string) => void;
}

export const CVDropzone: React.FC<CVDropzoneProps> = ({ jobId, onUploadComplete, onError }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);

  const handleShowRejectedModal = () => setShowRejectedModal(true);

  const { validateFile } = useCVValidation();
  const {
    uploading,
    uploadProgress,
    uploadFiles,
    rejectedFiles,
    setRejectedFiles
  } = useFileUploader(jobId);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const rejected: { name: string; reason: string }[] = [];

    for (const file of acceptedFiles) {
      if (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);
          for (const entry of Object.values(zip.files)) {
            if (entry.dir) continue;
            const name = entry.name;
            const ext = name.split('.').pop()?.toLowerCase() || '';
            const mimeTypeMap: Record<string, string> = {
              pdf: 'application/pdf',
              png: 'image/png',
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
            };
            const mimeType = mimeTypeMap[ext];
            if (mimeType) {
              const blob = await entry.async('blob');
              const extractedFile = new File([blob], name, { type: mimeType });
              const { valid, reason } = validateFile(extractedFile);
              if (valid) validFiles.push(extractedFile);
              else rejected.push({ name, reason: reason! });
            } else {
              rejected.push({ name, reason: 'Tipo no permitido dentro del ZIP' });
            }
          }
        } catch (err) {
          console.error(err);
          rejected.push({ name: file.name, reason: 'Error al descomprimir ZIP' });
        }
      } else {
        const { valid, reason } = validateFile(file);
        if (valid) validFiles.push(file);
        else rejected.push({ name: file.name, reason: reason || 'Archivo inválido' });
      }
    }

    if (rejected.length > 0) {
      setRejectedFiles(prev => [...prev, ...rejected]);
      setShowRejectedModal(true);
    }
    setFiles(prev => [...prev, ...validFiles]);
  }, [validateFile, setRejectedFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/zip': ['.zip'],
    },
  });

  const handleRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    await uploadFiles(
      files,
      (urls) => {
        onUploadComplete?.(urls);
        setFiles([]); // limpiar al terminar
        setShowFilesModal(false);
      },
      onError || (() => {})
    );
  };

  const doneCount = files.filter(f => uploadProgress[f.name] === 100).length;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 min-h-[120px] flex flex-col items-center justify-center
          ${isDragActive
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="mb-3">
          <DocumentArrowUpIcon className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 mb-1">
          {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra y suelta archivos aquí, o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-gray-500 mb-4">Solo PDF, PNG, JPG, ZIP - máximo 5MB por archivo</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); open(); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Seleccionar archivos
        </button>
      </div>

      {/* Vista comprimida: no más lista inline */}
      {files.length > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-2">
          <span className="text-sm text-blue-800 font-medium">
            {files.length} archivo{files.length !== 1 ? 's' : ''} seleccionado{files.length !== 1 ? 's' : ''} · {doneCount} subido{doneCount !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setShowFilesModal(true)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Ver archivos
          </button>
        </div>
      )}

      {/* Modal de archivos */}
      <CVFilesModal
        open={showFilesModal}
        files={files}
        uploadProgress={uploadProgress}
        uploading={uploading}
        onClose={() => setShowFilesModal(false)}
        onRemove={handleRemove}
        onUploadAll={handleUploadAll}
        rejectedFiles={rejectedFiles}
      />

      {/* Modal de rechazados (tu flujo actual) */}
      <RejectedCVsModal
        isOpen={showRejectedModal}
        onClose={() => setShowRejectedModal(false)}
        rejectedFiles={rejectedFiles}
        onClear={() => setRejectedFiles([])}
      />

      {rejectedFiles.length > 0 && (
        <button
          type="button"
          onClick={handleShowRejectedModal}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
        >
          Ver CVs Rechazados ({rejectedFiles.length})
        </button>
      )}
    </div>
  );
};