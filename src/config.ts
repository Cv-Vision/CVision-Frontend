export const CONFIG = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  bucketUrl: import.meta.env.VITE_BUCKET_URL as string,
  clientId: import.meta.env.VITE_CLIENT_ID as string,
  cognitoEndpoint: import.meta.env.VITE_COGNITO_ENDPOINT as string,
};