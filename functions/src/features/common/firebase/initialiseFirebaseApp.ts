// spell-checker:ignore appspot
import { cert, initializeApp } from 'firebase-admin/app';
import { app, apps } from 'firebase-admin';

import {
  SA_PROJECT_NAME,
  SA_SDK_KEY,
  SA_SDK_ID,
  SA_CLIENT_EMAIL,
  SA_CLIENT_ID,
  SA_CERT_URL,
} from './serviceAccountConfig';

// Get configuration from the environment - note that this allows the values to be
// be set by tests via mock configuration

export function initialiseFirebaseApp() {
  const serviceAccount = {
    type: 'service_account',
    projectId: SA_PROJECT_NAME,
    privateKeyId: SA_SDK_ID,
    privateKey: SA_SDK_KEY.replace(/\\n/g, '\n'),
    clientEmail: SA_CLIENT_EMAIL,
    clientId: SA_CLIENT_ID,
    authUri: 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: 'https://oauth2.googleapis.com/token',
    authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
    clientX509CertUrl: SA_CERT_URL,
  };

  console.log(`Initializing the Firestore app (${SA_PROJECT_NAME})`);
  // Initialize the app
  if (apps.length < 1) {
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${SA_PROJECT_NAME}.firebaseio.com`,
      storageBucket: `gs://${SA_PROJECT_NAME}.appspot.com`,
    });
  } else {
    app();
  }
}
