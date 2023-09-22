import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';

export async function deleteFoo(request: Request, response: Response) {
  const fooId = request.params['id'];

  const { serviceLogger } = createServiceLogger('deleteFoo');
  serviceLogger.info(`start for ${fooId}`, { fooId });

  response.send(`Delete this foos - ${fooId}`);
}
