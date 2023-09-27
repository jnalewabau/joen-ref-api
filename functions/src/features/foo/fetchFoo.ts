import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';
import { Logger } from 'winston';
import { Result, err, ok } from 'neverthrow';
import { Foo } from './foo';
import { createFunctionLogger } from '../common/logger/createFunctionLogger';
import {
  HTTP_INTERNAL_SERVICE_ERROR_CODE,
  HTTP_SUCCESS_CODE,
} from '../common/express/types/constants';
import { FSCollectionConfig } from '../common/firebase/firestore/FSCollectionConfig';

export async function readFoo(request: Request, response: Response) {
  const fooId = request.params['id'];

  const { serviceLogger } = createServiceLogger('readFoo');
  serviceLogger.info(`start for ${fooId}`, { fooId });

  const result = await readFooHandler(fooId, serviceLogger);

  if (result.isErr()) {
    response.status(HTTP_INTERNAL_SERVICE_ERROR_CODE).send(`Error getting foo: ${result.error}`);
    return;
  }

  response.status(HTTP_SUCCESS_CODE).send(result.value);
}

/**
 *
 * @param parentLogger
 * @returns
 */
async function readFooHandler(id: string, parentLogger: Logger): Promise<Result<Foo, string>> {
  const { functionLogger } = createFunctionLogger('readFooHandler', parentLogger);

  functionLogger.debug(`start for ${id}`);

  // Use firestore helper class
  const fsHelper = FSCollectionConfig.partnerFoos('partner1');

  const result = await fsHelper.getSingleWithProperty('externalId', id);

  if (result.isErr()) {
    return err(`Unable to find foo: ${result.error}`);
  }

  // Strip the firestoreId from the result
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { firestoreId, ...dataToReturn } = result.value;

  return ok(dataToReturn);
}
