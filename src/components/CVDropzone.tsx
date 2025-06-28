import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { fetchWithAuth } from '../services/fetchWithAuth';

interface CVDropzoneProps {
  jobId: string;
  onUploadComplete?: (fileUrls: string[]) => void;
  onError?: (error: string) => void;
}

interface PresignedUrlResponse {
  job_id: string;
  presigned_urls: Array<{
    filename: string;
    sanitized_filename: string;
    upload_url: string;
    s3_key: string;
  }>;
}

// Allowed types and extensions for CVs
const allowedTypes: { [key: string]: string[] } = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

const flatAllowedTypes = Object.keys(allowedTypes)

export const CVDropzone: React.FC<CVDropzoneProps> = ({ jobId, onUploadComplete, onError }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      return flatAllowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // Max 5MB
    });
    const rejected = acceptedFiles.filter(file => !flatAllowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024);
    if (rejected.length > 0) {
      onError?.('Algunos archivos fueron rechazados (tipo no permitido o tamaño > 5MB)');
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: allowedTypes,
    multiple: true,
    noClick: false,
    noKeyboard: false
  });

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[files[index].name];
      return newProgress;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    try {
      // Get presigned URLs for all files
      const response = await fetchWithAuth(
        'https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/generate_presigned_url_handler',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            job_id: jobId,
            filenames: files.map(file => file.name)
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = 'Error al obtener las URLs prefirmadas';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Silently handle JSON parse error
        }
        throw new Error(errorMessage);
      }

      const data: PresignedUrlResponse = await response.json();

      // Upload each file using its presigned URL
      for (const file of files) {
        try {
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
          
          // Find the presigned URL for this file
          const presignedUrlData = data.presigned_urls.find(
            url => url.filename === file.name
          );

          if (!presignedUrlData) {
            throw new Error(`No se encontró URL prefirmada para ${file.name}`);
          }

          // Upload to S3
          const uploadResponse = await fetch(presignedUrlData.upload_url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
            mode: 'cors',
          });

          if (!uploadResponse.ok) {
            throw new Error(`Error al subir ${file.name}`);
          }

          // Store the S3 key as the file URL
          uploadedUrls.push(presignedUrlData.s3_key);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        } catch (error) {
          errors.push(`Error al subir ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
        }
      }

      if (errors.length > 0) {
        onError?.(errors.join('\n'));
      }

      if (uploadedUrls.length > 0) {
        onUploadComplete?.(uploadedUrls);
        setFiles([]);
        setUploadProgress({});
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error desconocido en el proceso de subida');
    } finally {
      setUploading(false);
    }
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
          {isDragActive
            ? 'Suelta los archivos aquí...'
            : 'Arrastra y suelta archivos aquí, o haz clic para seleccionar'}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Solo PDF, PNG, JPG - máximo 5MB por archivo
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
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
                onClick={() => removeFile(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                disabled={uploading}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={uploadFiles}
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
    </div>
  );
}; 