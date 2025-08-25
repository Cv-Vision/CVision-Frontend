interface SignUpParams {
  name: string;
  password: string;
  email: string;
  role: 'APPLICANT' | 'RECRUITER';
}

export async function signUp({ name, password, email, role }: SignUpParams) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      password,
      email,
      role,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error signing up');
  }

  return response.json();
}

interface ConfirmSignUpParams {
  username: string;
  code: string;
  email: string;
}

export async function confirmSignUp({ username, code, email }: ConfirmSignUpParams) {
  const response = await fetch('/api/auth/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: username,
      confirmation_code: code,
      email: email,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error confirming sign up');
  }

  return response.json();
}

interface SignInParams {
  username: string;
  password: string;
}

export async function signIn({ username, password }: SignInParams) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: username, // The login form uses email as username
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error signing in');
  }

  const data = await response.json();

  // The user wants to use the access_token from the response.
  return {
    AuthenticationResult: {
      IdToken: data.access_token,
    },
  };
}


export function getIdToken() {
  return sessionStorage.getItem('idToken');
}

export function logout() {
  sessionStorage.removeItem('idToken');
  sessionStorage.removeItem('user');
}

interface ResendConfirmationCodeParams {
  username: string;
}

export async function resendConfirmationCode({ username }: ResendConfirmationCodeParams) {
    console.error("resendConfirmationCode is not implemented for the new backend");
    return Promise.resolve({});
}
