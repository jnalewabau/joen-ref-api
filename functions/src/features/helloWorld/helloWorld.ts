import * as logger from 'firebase-functions/logger';
import * as functions from 'firebase-functions';
import { DEFAULT_REGION } from '../common/firebase/cloudFunctions';

export const helloWorld = functions
  .region(DEFAULT_REGION)
  .https.onRequest(async (request, response) => {
    logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from joejoe Firebase!');
  });
