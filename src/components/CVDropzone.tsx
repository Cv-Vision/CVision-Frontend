import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { fetchWithAuth } from '../services/fetchWithAuth';

interface CVDropzoneProps {
  jobId: string;
  onUploadComplete?: (fileUrls: string[]) => void;
  onError?: (error: string) => void;
}

export const CVDropzone: React.FC<CVDropzoneProps> = ({ jobId, onUploadComplete, onError }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Debug log when component mounts or jobId changes
  useEffect(() => {
    console.log('CVDropzone mounted/updated with jobId:', jobId);
  }, [jobId]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    
    // Filter only PDF files
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== acceptedFiles.length) {
      onError?.('Solo se permiten archivos PDF');
      return;
    }

    // Check file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = pdfFiles.filter(file => file.size <= maxSize);
    if (validFiles.length !== pdfFiles.length) {
      onError?.('Algunos archivos superan el límite de 5MB');
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    noClick: false,
    noKeyboard: false
  });

  // Debug log for drag state
  useEffect(() => {
    console.log('Drag active:', isDragActive);
  }, [isDragActive]);

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[files[index].name];
      return newProgress;
    });
  };

  const uploadFile = async (file: File) => {
    try {
      console.log('Uploading file:', file.name, 'for job:', jobId);
      
      // Get presigned URL
      const response = await fetchWithAuth('/api/generate_presigned_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          jobId: jobId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener la URL prefirmada');
      }

      const { uploadUrl, fileUrl } = await response.json();
      console.log('Got presigned URL:', uploadUrl);

      // Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir el archivo');
      }

      console.log('File uploaded successfully:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        const fileUrl = await uploadFile(file);
        uploadedUrls.push(fileUrl);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        errors.push(`Error al subir ${file.name}`);
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

    setUploading(false);
  };

  return (
    <div className="w-full min-h-[200px] relative">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors min-h-[200px] flex flex-col items-center justify-center
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        style={{ zIndex: 1 }}
      >
        <input {...getInputProps()} />
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Suelta los archivos aquí...'
            : 'Arrastra y suelta archivos PDF aquí, o haz clic para seleccionar'}
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
            onClick={handleUpload}
            disabled={uploading}
            className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium
              ${uploading
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