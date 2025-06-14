import { ClipboardDocumentListIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const mockApplications: any[] = [];

const Applications = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-10 flex flex-col items-center">
        <ClipboardDocumentListIcon className="h-10 w-10 text-blue-400 mb-4" />
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Mis Postulaciones</h2>
        {mockApplications.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <ExclamationCircleIcon className="h-12 w-12 text-blue-200 mb-4" />
            <p className="text-gray-500 text-lg text-center">Aún no has realizado ninguna postulación.<br />Cuando apliques a un puesto, aparecerá aquí.</p>
          </div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="px-2">Puesto</th>
                <th className="px-2">Empresa</th>
                <th className="px-2">Estado</th>
                <th className="px-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {mockApplications.map(app => (
                <tr key={app.id} className="bg-blue-50 rounded-lg">
                  <td className="px-2 py-2 font-semibold text-gray-800">{app.jobTitle}</td>
                  <td className="px-2 py-2">{app.company}</td>
                  <td className="px-2 py-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-200 text-blue-700 text-xs font-bold">
                      {app.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-gray-500 text-sm">{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Applications; 