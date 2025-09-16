// src/components/GuestApplicationConfirmationModal.tsx
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
        setError(null);
        try {
            await axios.post(`${CONFIG.apiUrl}/guest/resend-link`, { email });
            setResent(true);
        } catch (err: any) {
            setError("No se pudo reenviar el mail. Intenta nuevamente.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-blue-800">¡Aplicación enviada!</h2>
                <p className="text-base text-gray-700">
                    Revisa tu mail para completar tu registro.<br />
                    <span className="font-semibold">¿Qué esperar?</span>
                    <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
                        <li>Recibirás un correo con instrucciones para finalizar tu registro.</li>
                        <li>El mail puede tardar unos minutos en llegar.</li>
                        <li>Si no lo ves, revisa la carpeta de spam o promociones.</li>
                    </ul>
                </p>
                {resent && (
                    <div className="text-green-700 bg-green-50 border-l-4 border-green-500 p-2 rounded">
                        Mail reenviado correctamente.
                    </div>
                )}
                {error && (
                    <div className="text-red-700 bg-red-50 border-l-4 border-red-500 p-2 rounded">
                        {error}
                    </div>
                )}
                <button
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
                    onClick={handleResend}
                    disabled={resending || resent}
                >
                    {resending ? "Reenviando..." : "Reenviar mail"}
                </button>
                <button
                    className="mt-2 text-blue-600 underline"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}