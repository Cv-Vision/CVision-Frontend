import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmSignUp } from '@/services/AuthService.ts';

const ConfirmAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(location.state?.username || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmSignUp({ username, code });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">Confirma tu Cuenta</h1>
        <form className="w-full flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Código de verificación"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-400 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-600 transition-colors text-lg"
            disabled={loading}
          >
            {loading ? 'Confirmando...' : 'Confirmar Cuenta'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 mt-2">
              Cuenta confirmada con éxito. Redirigiendo al login...
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ConfirmAccount;
