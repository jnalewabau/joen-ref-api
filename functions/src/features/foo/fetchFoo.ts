import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';

export async function readFoo(request: Request, response: Response) {
  const fooId = request.params['id'];

  const { serviceLogger } = createServiceLogger('readFoo');
  serviceLogger.info(`start for ${fooId}`, { fooId });

  response.send(`Have this foo - ${fooId}`);
}
