import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid';
import RejectedCVsModal from './RejectedCVsModal'; // asegúrate de que el path sea correcto
import { useCVValidation } from '../hooks/useCVValidation';
import JSZip from 'jszip';
import { useFileUploader } from '../hooks/useFileUploader';

interface CVDropzoneProps {
  jobId: string;
  onUploadComplete?: (fileUrls: string[]) => void;
  onError?: (error: string) => void;
}

export const CVDropzone: React.FC<CVDropzoneProps> = ({ jobId, onUploadComplete, onError }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);

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
      if (file.type === 'application/zip') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);
          for (const entry of Object.values(zip.files)) {
            if (entry.dir) continue;
            const name = entry.name;
            const ext = name.split('.').pop()?.toLowerCase() || '';
            const mimeTypeMap: { [ext: string]: string } = {
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
      setShowModal(true);
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

  const handleUpload = async () => {
    if (files.length === 0) return;
    await uploadFiles(files, urls => {
      onUploadComplete?.(urls);
      setFiles([]);
    }, onError || (() => {}));
  };

  return (
    <div className="w-full min-h-[200px] relative">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center backdrop-blur-sm
          ${isDragActive
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-200/50 scale-105'
          : 'border-blue-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-blue-100/50 hover:shadow-md hover:shadow-blue-200/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${
          isDragActive
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
            : 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-md shadow-blue-400/20'
        }`}>
          <DocumentArrowUpIcon className="h-12 w-12 text-white" />
        </div>
        <p className="mt-2 text-base font-medium text-gray-700">
          {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra y suelta archivos aquí, o haz clic para seleccionar'}
        </p>
        <p className="mt-2 text-sm text-gray-500">Solo PDF, PNG, JPG, ZIP - máximo 5MB por archivo</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); open(); }}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
        >
          Seleccionar archivos
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Archivos seleccionados:</h4>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
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
                onClick={() => handleRemove(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                disabled={uploading}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className={`mt-6 w-full py-3 px-6 rounded-xl text-white font-semibold transition-all duration-300 shadow-md
              ${uploading || files.length === 0
              ? 'bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Subiendo archivos...</span>
              </div>
            ) : (
              `Subir ${files.length} CV${files.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      )}

      <RejectedCVsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        rejectedFiles={rejectedFiles}
        onClear={() => setRejectedFiles([])}
      />
    </div>
  );
};
