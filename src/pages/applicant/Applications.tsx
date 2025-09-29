import { ClipboardDocumentListIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const mockApplications: any[] = [];

const Applications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
        <div className="flex flex-col items-center">
          <ClipboardDocumentListIcon className="h-16 w-16 text-blue-600 mb-6" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-8 text-center">
            Mis Postulaciones
          </h2>
          {mockApplications.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <ExclamationCircleIcon className="h-16 w-16 text-blue-200 mb-6" />
              <p className="text-blue-600 text-lg text-center font-medium">
                Aún no has realizado ninguna postulación.<br />
                Cuando apliques a un puesto, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-blue-600 text-sm font-semibold">
                    <th className="px-4 py-3">Puesto</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {mockApplications.map(app => (
                    <tr key={app.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <td className="px-4 py-3 font-semibold text-blue-800">{app.jobTitle}</td>
                      <td className="px-4 py-3 text-blue-700">{app.company}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-200 text-blue-700 text-xs font-bold">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-600 text-sm">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications; 