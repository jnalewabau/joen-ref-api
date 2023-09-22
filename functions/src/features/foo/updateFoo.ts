import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';

export async function updateFoo(request: Request, response: Response) {
  const fooId = request.params['id'];

  const { serviceLogger } = createServiceLogger('updateFoo');
  serviceLogger.info(`start for ${fooId}`, { fooId });

  response.send(`Update this foo - ${fooId}`);
}
