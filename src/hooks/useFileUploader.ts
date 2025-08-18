import { useState } from 'react';
import { fetchWithAuth } from '../services/fetchWithAuth';

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
      const response = await fetchWithAuth(
        `${process.env.REACT_APP_API_URL}/cv/generate-presigned-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin,
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            job_id: jobId,
            filenames: files.map(f => f.name),
          }),
        }
      );

      if (!response.ok) {
        let msg = 'Error al obtener URLs prefirmadas';
        try {
          const err = await response.json();
          msg = err.error || msg;
        } catch {}
        new Error(msg);
      }

      const data = await response.json();

      for (const file of files) {
        try {
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

          const urlData = data.presigned_urls.find((u: any) => u.filename === file.name);
          if (!urlData) new Error(`No URL prefirmada para ${file.name}`);

          const res = await fetch(urlData.upload_url, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });

          if (!res.ok) new Error(`Error al subir ${file.name}`);

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
        console.error(errorMsg); // log interno
        // no llamar a onError si ya hubo error por tipo/tamaño
      }

    } catch (err: any) {
      onError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadProgress, uploadFiles, rejectedFiles, setRejectedFiles };
};