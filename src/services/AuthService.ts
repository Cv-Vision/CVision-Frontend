const CLIENT_ID = '7q9u97f4vklogma8e8vipfvb0d';
const REGION = 'us-east-2';
const COGNITO_ENDPOINT = `https://cognito-idp.${REGION}.amazonaws.com/`;

interface SignUpParams {
  username: string;
  password: string;
  email: string;
}

interface ConfirmSignUpParams {
  username: string;
  code: string;
}

interface SignInParams {
  username: string;
  password: string;
}

export async function signUp({ username, password, email }: SignUpParams) {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
    },
    body: JSON.stringify({
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error signing up');
  }

  return response.json();
}

export async function confirmSignUp({ username, code }: ConfirmSignUpParams) {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
    },
    body: JSON.stringify({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error confirming sign up');
  }

  return response.json();
}

export async function signIn({ username, password }: SignInParams) {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify({
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
    }),
  });

  const data = await response.json(); // ✅ Parse una sola vez

  if (!response.ok) {
    console.error('Sign in error:', data); // ✅ Mostrar error en consola
    throw new Error(data.message || 'Error signing in');
  }

  const idToken = data.AuthenticationResult?.IdToken;
  if (!idToken) {
    console.error('Missing IdToken in response:', data); // ✅ Si no hay token, mostrar error
    throw new Error('No se obtuvo token');
  }

  sessionStorage.setItem('idToken', idToken);
  return data;
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
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.ResendConfirmationCode',
    },
    body: JSON.stringify({
      ClientId: CLIENT_ID,
      Username: username,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error reenviando código de confirmación');
  }

  return response.json();
}
