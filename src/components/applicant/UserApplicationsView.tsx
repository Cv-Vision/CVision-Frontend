import { useEffect, useState } from 'react';

export function UserApplicationsView() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/applications')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setApplications(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setApplications([]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Mis Postulaciones</h2>
            {applications.length === 0 ? (
                <p>No tienes postulaciones.</p>
            ) : (
                <ul>
                    {applications.map(app => (
                        <li key={app.id}>{app.positionTitle}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}