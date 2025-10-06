import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInViaBackend } from '@/services/AuthService';
import { decodeJwt, useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { UserRole } from '@/types/auth';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const doLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const backendLogin = await signInViaBackend({ username: email, password });
      const token = backendLogin?.cognito_tokens?.id_token as string | undefined;

      if (!token) {
        throw Object.assign(new Error('No se pudo obtener el token de sesión'), { status: 500 });
      }

      const decodedToken = decodeJwt(token);
      const userType = decodedToken ? decodedToken['custom:userType'] : null;
      const normalizedUserType = userType?.toUpperCase();
      if (!normalizedUserType || (normalizedUserType !== 'RECRUITER' && normalizedUserType !== 'APPLICANT' && normalizedUserType !== 'ADMIN')) {
        throw Object.assign(new Error('Tipo de usuario no válido o no encontrado en el token.'), { status: 400 });
      }

      const role: UserRole = normalizedUserType === 'RECRUITER' ? 'recruiter' : 
                             normalizedUserType === 'ADMIN' ? 'admin' : 'applicant';

      if (login) login({ email, role, token });

      const redirectUrl = localStorage.getItem('redirectAfterAuth');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirectUrl);
      } else {
        if (role === 'applicant') {
          navigate('/applicant/dashboard', { state: { justLoggedIn: true, userName: decodedToken?.name || email.split('@')[0] } });
        } else if (role === 'admin') {
          navigate('/admin/metrics');
        } else {
          navigate('/recruiter/dashboard');
        }
      }
    } catch (err: any) {
      const msg: string = err?.message || '';
      const status: number | undefined = err?.status;
      const backendUsername: string | undefined = err?.username;
      const backendRole: string | undefined = err?.role;

      if (status === 409) {
        const usernameForConfirm = backendUsername || email;
        const roleUpper = backendRole?.toUpperCase();
        showToast('Tu email no está confirmado. Revisa tu correo y confirma tu cuenta.', 'error');
        if (roleUpper === 'RECRUITER') {
          navigate(`/recruiter-confirm?username=${encodeURIComponent(usernameForConfirm)}&email=${encodeURIComponent(email)}`);
        } else {
          navigate(`/applicant-confirm?username=${encodeURIComponent(usernameForConfirm)}&email=${encodeURIComponent(email)}`);
        }
        return;
      }

      if (status === 401) {
        if (/not\s*found/i.test(msg)) {
          showToast('El correo no existe o está mal escrito.', 'error');
        } else {
          showToast('Usuario o contraseña incorrectos.', 'error');
        }
        return;
      }

      showToast(msg || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { login: doLogin, loading };
}


