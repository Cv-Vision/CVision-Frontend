import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadCV } from '@/services/applicantService.ts';
import { CONFIG } from '@/config';

interface ApplicantCVDropzoneProps {
  onCVProcessed: (cvData: any) => void;
}

const ApplicantCVDropzone: React.FC<ApplicantCVDropzoneProps> = ({ onCVProcessed }) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [uploadedCVUrl, setUploadedCVUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [progressPhase, setProgressPhase] = useState<'idle' | 'ramp' | 'hold' | 'to98' | 'wait'>('idle');

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
      setProgress(5);
      setIsSimulating(true);
      setProgressPhase('ramp');
      try {
        // Subir el CV usando el servicio
        const cvrResponse = await uploadCV(file);
        setUploadedCVUrl(cvrResponse.cvUrl);
        // Obtener info extraída
        const cvRes = await fetch(`${CONFIG.apiUrl}/cv/information/${cvrResponse.s3Key}`);
        const cvData = (await cvRes.json()).data;

        // Llamar al callback con la información del CV
        onCVProcessed({
          ...cvData,
          cvUrl: cvrResponse.cvUrl,
          fileName: file.name,
          fileSize: file.size,
        });
        
        setError(null);
        // Finalizar progreso y colapsar el uploader
        setIsSimulating(false);
        setProgress(100);
        setProgressPhase('idle');
        setExpanded(false);
      } catch (err: any) {
        setError(err.message || 'Error al subir o procesar el CV.');
        console.error('Error uploading CV:', err);
      } finally {
        setTimeout(() => {
          setUploading(false);
          setIsSimulating(false);
          setProgressPhase('idle');
        }, 300);
      }
    },
    [onCVProcessed]
  );

  // Simulacion de progreso en barra de carga mientras se espera extraccion de datos del CV
  useEffect(() => {
    if (!uploading || !isSimulating || progressPhase !== 'ramp') return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 75) {
          return 75;
        }
        const increment = Math.random() * 3 + 1; // 1% - 4%
        const next = prev + increment;
        if (next >= 75) {
          // Pasar a fase de espera en 75%
          setProgressPhase('hold');
          return 75;
        }
        return next;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [uploading, isSimulating, progressPhase]);

  // Tras 1.5s en 75%, subir a 90%
  useEffect(() => {
    if (!uploading || !isSimulating || progressPhase !== 'hold') return;
    const t = setTimeout(() => {
      setProgress(90);
      setProgressPhase('to98');
    }, 1500);
    return () => clearTimeout(t);
  }, [uploading, isSimulating, progressPhase]);

  // Luego de un tiempo, subir a 98% y esperar fin real
  useEffect(() => {
    if (!uploading || !isSimulating || progressPhase !== 'to98') return;
    const t = setTimeout(() => {
      setProgress(98);
      setProgressPhase('wait');
    }, 1800);
    return () => clearTimeout(t);
  }, [uploading, isSimulating, progressPhase]);

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
              <div className="mt-4">
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-blue-700 font-medium mt-2 flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Extrayendo datos de tu CV por ti...
                </p>
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
