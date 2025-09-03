import { useState } from 'react';
import { fetchWithAuth } from '../services/fetchWithAuth';
import { CONFIG } from '@/config';

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
      const cleanJobId = jobId.startsWith('JD#') ? jobId.substring(3) : jobId;
      const response = await fetchWithAuth(
        `${CONFIG.apiUrl}/job-postings/${cleanJobId}/cvs`, 
        {
          method: 'POST',
          body: JSON.stringify({
            job_id: cleanJobId,
            filenames: files.map(f => f.name),
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
      if (!Array.isArray(data.upload_urls)) {
        throw new Error('Invalid response format: upload_urls is not an array');
      }

      for (const file of files) {
        try {
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

          const urlData = data.upload_urls.find((u: any) => u.s3_key.endsWith(file.name));
          if (!urlData) throw new Error(`No URL prefirmada para ${file.name}`);

          const res = await fetch(urlData.upload_url, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });

          if (!res.ok) throw new Error(`Error al subir ${file.name}`);

          uploadedUrls.push(urlData.s3_key);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        } catch (err: any) {
          errors.push(`Error con ${file.name}: ${err.message}`);
          setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
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