import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadCV } from '@/services/applicantService.ts';

interface ApplicantCVDropzoneProps {
  onCVProcessed: (cvData: any) => void;
}

const ApplicantCVDropzone: React.FC<ApplicantCVDropzoneProps> = ({ onCVProcessed }) => {
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
      <div className="border-2 border-blue-200 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 mb-6">
        <button
          type="button"
          className="w-full text-blue-700 font-semibold py-3 text-lg hover:text-blue-800 transition-colors duration-300"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Cerrar' : 'Adjuntar CV'}
        </button>
        {expanded && (
          <div className="mt-6">
            {uploadedCVUrl ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-800">CV subido exitosamente</p>
                      <p className="text-sm text-green-600">El archivo está listo para ser incluido en tu perfil</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedCVUrl(null);
                      onCVProcessed({ cvUrl: null, fileName: null, fileSize: null });
                    }}
                    className="text-green-600 hover:text-green-800 text-sm font-semibold px-4 py-2 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 min-h-[140px] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'}
                `}
                style={{ outline: 'none' }}
              >
                <input {...getInputProps()} />
                <p className="text-lg font-semibold text-blue-700 mb-4">
                  {isDragActive
                    ? 'Suelta el archivo PDF aquí...'
                    : 'Arrastra y suelta tu CV en PDF aquí, o haz clic para seleccionar'}
                </p>
                <button
                  type="button"
                  onClick={open}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  disabled={uploading}
                >
                  Seleccionar archivo
                </button>
                <p className="mt-4 text-sm text-blue-600 font-medium">Solo PDF, máximo 5MB</p>
              </div>
            )}
            {uploading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo y procesando...
                </div>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-600 font-medium text-center">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantCVDropzone;
