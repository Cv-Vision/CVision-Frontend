
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error signing in');
  }

  const data = await response.json();

  // Guarda el access token en sessionStorage
  sessionStorage.setItem('accessToken', data.AuthenticationResult.AccessToken);

  return data;
}

export function getAccessToken() {
  return sessionStorage.getItem('accessToken');
}

export function logout() {
  sessionStorage.removeItem('accessToken');
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
    // AWS Cognito devuelve un objeto con .message
    throw new Error(err.message || 'Error reenviando código de confirmación');
  }

  // Si quieres obtener datos de la respuesta, puedes hacer return response.json()
  return response.json();
}