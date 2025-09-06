import {useUserApplications} from "@/hooks/useUserApplications.ts";


export function UserApplicationsView() {
    const { applications, loading } = useUserApplications();

    if (loading) return <div>Cargando...</div>;
    if (applications.length === 0) return <div>No tienes postulaciones.</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Mis Postulaciones</h2>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th>Puesto</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                {applications.map(app => (
                    <tr key={app.id}>
                        <td>{app.position}</td>
                        <td>{app.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}