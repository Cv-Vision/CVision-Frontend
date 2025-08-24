import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadCV } from '@/services/candidateService';

interface CandidateCVDropzoneProps {
  onCVProcessed: (cvData: any) => void;
}

const CandidateCVDropzone: React.FC<CandidateCVDropzoneProps> = ({ onCVProcessed }) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [uploadedCVUrl, setUploadedCVUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.type !== 'application/pdf') {
        setError('Solo se permite subir archivos PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no puede superar los 5MB.');
        return;
      }
      setUploading(true);
      try {
        // Subir el CV usando el servicio
        const cvUrl = await uploadCV(file);
        setUploadedCVUrl(cvUrl);
        
        // Llamar al callback con la información del CV
        onCVProcessed({
          cvUrl: cvUrl,
          fileName: file.name,
          fileSize: file.size,
        });
        
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al subir o procesar el CV.');
        console.error('Error uploading CV:', err);
      } finally {
        setUploading(false);
      }
    },
    [onCVProcessed]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    accept: { 'application/pdf': ['.pdf'] },
  });

  return (
    <div className="w-full">
      <div className="border rounded-xl bg-blue-50 px-4 py-3 mb-4">
        <button
          type="button"
          className="w-full text-blue-700 font-semibold py-2"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Cerrar' : 'Adjuntar CV'}
        </button>
        {expanded && (
          <div className="mt-4">
            {uploadedCVUrl ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">CV subido exitosamente</p>
                      <p className="text-xs text-green-600">El archivo está listo para ser incluido en tu perfil</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedCVUrl(null);
                      onCVProcessed({ cvUrl: null, fileName: null, fileSize: null });
                    }}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[120px] flex flex-col items-center justify-center bg-white
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-300'}
                `}
                style={{ outline: 'none' }}
              >
                <input {...getInputProps()} />
                <p className="text-base font-medium text-gray-700">
                  {isDragActive
                    ? 'Suelta el archivo PDF aquí...'
                    : 'Arrastra y suelta tu CV en PDF aquí, o haz clic para seleccionar'}
                </p>
                <button
                  type="button"
                  onClick={open}
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium"
                  disabled={uploading}
                >
                  Seleccionar archivo
                </button>
                <p className="mt-2 text-sm text-gray-500">Solo PDF, máximo 5MB</p>
              </div>
            )}
            {uploading && <p className="mt-2 text-blue-600">Subiendo y procesando...</p>}
            {error && <p className="mt-2 text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCVDropzone;
