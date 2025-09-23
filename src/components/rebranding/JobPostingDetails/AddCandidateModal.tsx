import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import JSZip from "jszip";

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validExtensions = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/zip",
      "application/x-zip-compressed",
    ];

    const validated: File[] = [];

    for (const file of selectedFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`El archivo ${file.name} supera los 5MB`);
        continue;
      }

      if (file.type === "application/zip" || file.type === "application/x-zip-compressed") {
        try {
          const zip = await JSZip.loadAsync(file);
          for (const [path, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir && path.endsWith(".pdf")) {
              const blob = await zipEntry.async("blob");
              validated.push(new File([blob], path, { type: "application/pdf" }));
            }
          }
        } catch (err) {
          setError(`Error leyendo ZIP: ${file.name}`);
        }
      } else if (validExtensions.includes(file.type)) {
        validated.push(file);
      } else {
        setError(`Formato no permitido: ${file.name}`);
      }
    }

    setFiles(validated);
    setError(null);
  };

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files);
      setFiles([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Agregar Nuevos Candidatos</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* File Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Currículums (PDF, Imágenes, ZIP)
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.zip,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm border rounded-md p-2"
          />
          <p className="text-xs text-gray-500">
            Puedes seleccionar múltiples archivos PDF, imágenes (JPG/PNG) o un ZIP con CVs en PDF.
          </p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className={`w-full py-2 rounded-lg text-white transition ${
              files.length === 0
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Agregar {files.length} Candidatos
          </button>
        </div>
      </div>
    </div>
  );
};
