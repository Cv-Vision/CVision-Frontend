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
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors min-h-[200px] flex flex-col items-center justify-center
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Suelta los archivos aquí...'
            : 'Arrastra y suelta archivos aquí, o haz clic para seleccionar'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Solo PDF, máximo 5MB por archivo
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Seleccionar archivos
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Archivos seleccionados:</h4>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div className="flex items-center space-x-2">
                <DocumentArrowUpIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{file.name}</span>
                {uploadProgress[file.name] === 100 && (
                  <span className="text-green-500 text-xs">✓</span>
                )}
                {uploadProgress[file.name] === -1 && (
                  <span className="text-red-500 text-xs">✗</span>
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600"
                disabled={uploading}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium
              ${uploading || files.length === 0
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {uploading ? 'Subiendo...' : 'Subir CVs'}
          </button>
        </div>
      )}
    </div>
  );
}; 