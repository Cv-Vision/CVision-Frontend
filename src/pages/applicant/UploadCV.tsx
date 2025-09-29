import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/other/BackButton.tsx';

export function UploadCV() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);

    if (!selectedFile) {
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Por favor, sube un archivo PDF o DOCX');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (selectedFile.size > maxSize) {
      setError('El archivo no debe superar los 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Simulate file upload and analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock successful upload
      navigate('/applicant/dashboard');
    } catch (err) {
      setError('Error al subir el archivo. Por favor, intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl sm:rounded-3xl border border-white/20">
          <div className="px-8 py-8 sm:p-12">
            <BackButton />
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent leading-6 mb-4">
              Sube tu CV
            </h3>
            <div className="mt-4 max-w-xl text-lg text-blue-700">
              <p>
                Sube tu CV en formato PDF o DOCX para que podamos analizarlo y encontrar las mejores oportunidades para ti.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-6">
                <div className="flex justify-center px-8 pt-8 pb-8 border-2 border-blue-200 border-dashed rounded-2xl bg-white/50 backdrop-blur-sm">
                  <div className="space-y-3 text-center">
                    <svg
                      className="mx-auto h-16 w-16 text-blue-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-lg text-blue-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-xl font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-4 py-2 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300"
                      >
                        <span>Sube un archivo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                      </label>
                      <p className="pl-3 self-center">o arrastra y suelta</p>
                    </div>
                    <p className="text-sm text-blue-500 font-medium">
                      PDF o DOCX hasta 5MB
                    </p>
                  </div>
                </div>

                {file && (
                  <div className="text-lg text-blue-600 font-medium bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    Archivo seleccionado: {file.name}
                  </div>
                )}

                {error && (
                  <div className="text-lg text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
                    {error}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!file || isUploading}
                    className={`inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                      !file || isUploading
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Analizando CV...
                      </>
                    ) : (
                      'Subir CV'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 