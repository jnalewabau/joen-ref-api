import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';

export async function listFoos(request: Request, response: Response) {
  const { serviceLogger } = createServiceLogger('listFoos');
  serviceLogger.info(`start`);

  response.send('Have all the foos!');
}
