import { useState } from "react";
import axios from "axios";
import { CONFIG } from "@/config.ts";

interface Props {
    email: string;
    onClose: () => void;
}

export default function GuestApplicationConfirmationModal({ email, onClose }: Props) {
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResend = async () => {
        setResending(true);
        setResent(false);
        setError(null);
        try {
            await axios.post(`${CONFIG.apiUrl}/guest/resend-link`, { email });
            setResent(true);
        } catch (err) {
            setError("No se pudo reenviar el mail. Intenta nuevamente.");
        } finally {
            setTimeout(() => setResending(false), 5000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">¡Aplicación enviada!</h2>
                <div className="text-base text-gray-700">
                    <p className="mb-2 text-center">
                        Revisa tu mail para completar tu registro.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">¿Qué esperar?</h4>
                        <ul className="list-disc ml-6 text-sm text-blue-700 space-y-1">
                            <li>Recibirás un correo con instrucciones para finalizar tu registro.</li>
                            <li>El mail puede tardar unos minutos en llegar.</li>
                            <li>Si no lo ves, revisa la carpeta de spam o promociones.</li>
                        </ul>
                    </div>
                </div>
                {resent && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-center font-medium">
                        Mail reenviado correctamente.
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-center font-medium">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-2 pt-2">
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleResend}
                        disabled={resending}
                    >
                        {resending ? "Reenviando..." : "Reenviar mail"}
                    </button>
                    <button
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}