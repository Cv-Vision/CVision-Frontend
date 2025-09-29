import { UserPlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleSelect = (role: 'applicant' | 'recruiter') => {
    if (role === 'applicant') {
      navigate('/applicant-register');
    } else {
      navigate('/recruiter-register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mb-6">
            <UserPlusIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Selecciona el tipo de usuario para continuar
          </p>
        </div>
        <div className="flex flex-col gap-6 mt-6">
          <button
            onClick={() => handleSelect('applicant')}
            className="w-full bg-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base"
          >
            👤 Aplicante
          </button>
          <button
            onClick={() => handleSelect('recruiter')}
            className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base"
          >
            🏢 Reclutador
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
