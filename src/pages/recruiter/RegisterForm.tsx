import React, { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { registerRecruiter } from '@/services/recruiterService.ts';
import { registerUser } from '@/services/registrationService';
import { useToast } from '../../context/ToastContext'; // Import useToast

const RecruiterRegisterForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast(); // Use the new useToast hook

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validar campos obligatorios
        if (!fullName.trim() || !email.trim() || !password.trim()) {
            showToast('Por favor completa todos los campos obligatorios', 'error'); // Use showToast
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            showToast('La contraseña debe tener al menos 8 caracteres', 'error'); // Use showToast
            setLoading(false);
            return;
        }

        try {
            // Primero le pega al backend nuestro
            await registerUser({ name: fullName, email, password, role: 'RECRUITER' });
            // despues a cognito
            await registerRecruiter({
                basicInfo: {
                    fullName,
                    email,
                    password
                },
                company: company.trim() || undefined,
                position: position.trim() || undefined
            });

            showToast('Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.', 'success'); // Use showToast
            
            // Redirigir a la página de confirmación después de 2 segundos
            setTimeout(() => {
                navigate(`/recruiter-confirm?username=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`);
            }, 2000);
            
        } catch (err: any) {
            console.error('Error al crear cuenta:', err);
            showToast(err.message || 'Error al crear la cuenta. Intenta nuevamente.', 'error'); // Use showToast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mb-6">
                        <UserPlusIcon className="h-10 w-10 text-white" />
                    </div>
                    {/* Título acortado y centrado */}
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2 text-center">
                        Cuenta de Reclutador
                    </h1>
                    <p className="text-gray-600 text-center text-sm">
                        Únete como reclutador a nuestra plataforma
                    </p>
                </div>

                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            placeholder="Tu nombre completo"
                            className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Correo electrónico *
                        </label>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Empresa (opcional)
                        </label>
                        <input
                            type="text"
                            placeholder="Nombre de tu empresa"
                            className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Cargo (opcional)
                        </label>
                        <input
                            type="text"
                            placeholder="Tu cargo o posición"
                            className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Registrando...
                            </div>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200/50">
                    <p className="text-gray-600 text-center text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecruiterRegisterForm;