import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserIcon } from '@heroicons/react/24/solid';

interface ReceivedCV {
  id: string;
  candidateName: string;
  date: string;
  status: 'pending' | 'reviewed' | 'rejected';
  matchScore: number;
}

export function RecruiterProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock received CVs data
  const receivedCVs: ReceivedCV[] = [
    {
      id: '1',
      candidateName: 'Juan Pérez',
      date: '2024-03-15',
      status: 'reviewed',
      matchScore: 85,
    },
    {
      id: '2',
      candidateName: 'María García',
      date: '2024-03-14',
      status: 'pending',
      matchScore: 92,
    },
    {
      id: '3',
      candidateName: 'Carlos López',
      date: '2024-03-13',
      status: 'rejected',
      matchScore: 45,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  const filteredCVs = receivedCVs.filter(cv =>
    cv.candidateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-10 flex flex-col items-center">
        <UserIcon className="h-12 w-12 text-green-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Mi Perfil (Reclutador)</h1>
        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Empresa / Organización"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-400 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-600 transition-colors text-lg"
          >
            Guardar cambios
          </button>
        </form>
      </div>

      <div className="bg-white shadow sm:rounded-lg mt-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              CVs Recibidos
            </h3>
            <div className="w-64">
              <input
                type="text"
                placeholder="Buscar candidato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Candidato
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fecha
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Coincidencia
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCVs.map((cv) => (
                        <tr key={cv.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cv.candidateName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(cv.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                cv.status === 'reviewed'
                                  ? 'bg-green-100 text-green-800'
                                  : cv.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {cv.status === 'reviewed'
                                ? 'Revisado'
                                : cv.status === 'pending'
                                ? 'Pendiente'
                                : 'Rechazado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cv.matchScore}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              onClick={() => {
                                // TODO: Implement view CV
                              }}
                            >
                              Ver CV
                            </button>
                            {cv.status === 'pending' && (
                              <>
                                <button
                                  className="text-green-600 hover:text-green-900 mr-4"
                                  onClick={() => {
                                    // TODO: Implement accept CV
                                  }}
                                >
                                  Aceptar
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    // TODO: Implement reject CV
                                  }}
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}