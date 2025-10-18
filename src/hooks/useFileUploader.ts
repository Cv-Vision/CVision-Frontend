import { useState } from 'react';
import { fetchWithAuth } from '../services/fetchWithAuth';
import { CONFIG } from '@/config';

const getFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const useFileUploader = (jobId: string) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [rejectedFiles, setRejectedFiles] = useState<{ name: string; reason: string }[]>([]);

  const uploadFiles = async (
    files: File[],
    onComplete: (urls: string[]) => void,
    onError: (msg: string) => void
  ) => {
    setUploading(true);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    try {
      const fileDetails = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          hash: await getFileHash(file),
        }))
      );

      const cleanJobId = jobId.startsWith('JD#') ? jobId.substring(3) : jobId;
      const response = await fetchWithAuth(
        `${CONFIG.apiUrl}/job-postings/${cleanJobId}/cvs`, 
        {
          method: 'POST',
          body: JSON.stringify({
            job_id: cleanJobId,
            file_details: fileDetails,
          }),
        }
      );

      if (!response.ok) {
        let msg = 'Error al obtener URLs prefirmadas';
        try {
          const err = await response.json();
          msg = err.error || msg;
        } catch { /* empty */ }
        throw new Error(msg);
      }

      const data = await response.json();
      if (!Array.isArray(data.upload_results)) {
        throw new Error('Invalid response format: upload_results is not an array');
      }

      for (const result of data.upload_results) {
        const file = files.find(f => f.name === result.filename);
        if (!file) continue; // Should not happen if filenames match

        if (result.status === "success") {
          try {
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

            const res = await fetch(result.upload_url, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': file.type },
            });

            if (!res.ok) throw new Error(`Error al subir ${file.name}`);

            uploadedUrls.push(result.s3_key);
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          } catch (err: any) {
            errors.push(`Error con ${file.name}: ${err.message}`);
            setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
          }
        } else if (result.status === "skipped") {
          let reasonMessage = result.message || 'Skipped';
          if (reasonMessage.includes("already exists")) {
            reasonMessage = "ya existe";
          }
          setRejectedFiles(prev => [...prev, { name: result.filename, reason: reasonMessage }]);
        }
      }

      if (uploadedUrls.length > 0) onComplete(uploadedUrls);
      if (errors.length > 0) {
        const errorMsg = errors.join('\n');
        console.error(errorMsg);
      }

    } catch (err: any) {
      onError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadProgress, uploadFiles, rejectedFiles, setRejectedFiles };
};