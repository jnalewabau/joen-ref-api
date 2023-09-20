import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';

export const createFoo = async (request: Request, response: Response) => {
  logger.info('Create foo', { structuredData: true });
  response.send('Create a foo');
};
