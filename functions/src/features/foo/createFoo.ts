import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';
import { createFunctionLogger } from '../common/logger/createFunctionLogger';

import { Result, ok } from 'neverthrow';
import { Logger } from 'winston';

/**
 *
 * @param request
 * @param response
 * @returns
 */
export async function createFoo(request: Request, response: Response) {
  const { serviceLogger } = createServiceLogger('createFoo');
  serviceLogger.info(`start`);

  const result = await createFooHandler(serviceLogger);

  if (result.isErr()) {
    response.send(`Error creating foo: ${result.error}`);
    return;
  }

  response.send(`Created foo`);
}

/**
 *
 * @param parentLogger
 * @returns
 */
async function createFooHandler(parentLogger: Logger): Promise<Result<string, string>> {
  const { functionLogger } = createFunctionLogger('createFooHandler', parentLogger);

  functionLogger.debug(`start`);

  return ok('Create a foo');
}
