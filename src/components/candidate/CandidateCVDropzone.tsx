import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface CandidateCVDropzoneProps {
  onCVProcessed: (cvData: any) => void;
}

const CandidateCVDropzone: React.FC<CandidateCVDropzoneProps> = ({ onCVProcessed }) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
        // TODO: Integrar con backend para subir el archivo y procesar el CV.
        // Ejemplo:
        // const formData = new FormData();
        // formData.append('cv', file);
        // const response = await fetch('/api/candidate/upload-cv', { method: 'POST', body: formData });
        // const data = await response.json();
        // onCVProcessed(data);

        // Dejar la integración aquí, no simular ni devolver datos mockeados.
      } catch (err) {
        setError('Error al subir o procesar el CV.');
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
            {uploading && <p className="mt-2 text-blue-600">Subiendo y procesando...</p>}
            {error && <p className="mt-2 text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCVDropzone;
