import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';

export const listFoos = async (request: Request, response: Response) => {
  logger.info('List all foos', { structuredData: true });
  response.send('Have all the foos!');
};
