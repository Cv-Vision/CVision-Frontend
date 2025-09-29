import React, { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { registerRecruiter } from '@/services/recruiterService.ts';
import { registerUser } from '@/services/registrationService';
import { useToast } from '../../context/ToastContext';
import { Briefcase } from 'lucide-react';

const RecruiterRegisterForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (password !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error'); // Use showToast
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
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-25 to-purple-50 flex flex-col items-center justify-center py-10 px-4 relative">
            {/* Background pattern with horizontal lines */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-25 to-purple-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(147, 51, 234, 0.02) 2px, rgba(147, 51, 234, 0.02) 4px)',
                }}></div>
            </div>
            
            {/* CVision Logo with purple colors */}
            <div className="relative z-10 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">CVision</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Cuenta de Reclutador
                    </h1>
                    <p className="text-gray-600 text-center text-sm mb-6">
                        Únete como reclutador a nuestra plataforma
                    </p>
                    
                    {/* Recruiter Icon */}
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center shadow-sm mb-6">
                        <UserPlusIcon className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Tu nombre completo"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Correo electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Confirmar contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
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
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3.5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading || password !== confirmPassword}
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

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 text-center text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            to="/login"
                            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 hover:underline"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-8">
                <p className="text-gray-500 text-center text-sm">
                    © 2025 CVision. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default RecruiterRegisterForm;