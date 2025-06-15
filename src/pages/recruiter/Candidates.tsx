import { UserIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Mock data para candidatos
const mockCandidates = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+54 11 1234-5678',
    position: 'Desarrollador Frontend',
    status: 'pending',
    cvUrl: '#',
    matchScore: 85,
    jobId: 'frontend-123',
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+54 11 8765-4321',
    position: 'Desarrollador Backend',
    status: 'reviewed',
    cvUrl: '#',
    matchScore: 92,
    jobId: 'backend-456',
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@email.com',
    phone: '+54 11 5555-6666',
    position: 'Desarrollador Full Stack',
    status: 'interviewed',
    cvUrl: '#',
    matchScore: 78,
    jobId: 'fullstack-789',
  }
];

const Candidates = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <UserIcon className="h-8 w-8 text-green-400" />
            <h1 className="text-3xl font-bold text-gray-800">Candidatos</h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <EnvelopeIcon className="h-4 w-4" />
                            {candidate.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <PhoneIcon className="h-4 w-4" />
                            {candidate.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{candidate.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-900">{candidate.matchScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          candidate.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {candidate.status === 'pending' ? 'Pendiente' : 
                         candidate.status === 'reviewed' ? 'Revisado' : 
                         'Entrevistado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          onClick={() => window.open(candidate.cvUrl, '_blank')}
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                          Ver CV
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          onClick={() => navigate(`/recruiter/job/${candidate.jobId}/analysis?highlight=${candidate.id}`)}
                        >
                          <ChartBarIcon className="h-5 w-5" />
                          Ver Análisis
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          onClick={() => alert('Funcionalidad de contacto en desarrollo')}
                        >
                          <PhoneIcon className="h-5 w-5" />
                          Contactar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates; 