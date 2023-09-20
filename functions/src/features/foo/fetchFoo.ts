import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';

export const readFoo = async (request: Request, response: Response) => {
  const fooId = request.params['id'];

  logger.info(`Read foo - ${fooId}!`, { structuredData: true, fooId });
  response.send(`Have this foo - ${fooId}`);
};
