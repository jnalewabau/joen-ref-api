import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';

export const deleteFoo = async (request: Request, response: Response) => {
  const fooId = request.params['id'];

  logger.info('Delete foo!', { structuredData: true, fooId });
  response.send(`Delete this foos - ${fooId}`);
};
