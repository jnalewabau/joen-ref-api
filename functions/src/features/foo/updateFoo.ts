import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';

export const updateFoo = async (request: Request, response: Response) => {
  const fooId = request.params['id'];

  logger.info('Update foo!', { structuredData: true, fooId });
  response.send(`Update this foo - ${fooId}`);
};
