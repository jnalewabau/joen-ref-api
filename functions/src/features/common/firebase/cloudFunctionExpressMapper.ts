import * as functions from 'firebase-functions';
import { Request, Response } from 'express';
import { DEFAULT_REGION } from './cloudFunctions';

export const newHttpFunction = (handler: (req: Request, resp: Response) => void | Promise<void>) =>
  functions
    .runWith({
      //   timeoutSeconds: MAX_CLOUD_FUNCTIONS_TIMEOUT_IN_SEC,
    })
    .region(DEFAULT_REGION)
    .https.onRequest(handler);
