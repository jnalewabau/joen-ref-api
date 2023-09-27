import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';
import { Result, err, ok } from 'neverthrow';
import { Logger } from 'winston';
import { createFunctionLogger } from '../common/logger/createFunctionLogger';
import {
  HTTP_INTERNAL_SERVICE_ERROR_CODE,
  HTTP_SUCCESS_CODE,
} from '../common/express/types/constants';
import { FSCollectionConfig } from '../common/firebase/firestore/FSCollectionConfig';

export async function deleteFoo(request: Request, response: Response) {
  const fooId = request.params['id'];

  const { serviceLogger } = createServiceLogger('deleteFoo');
  serviceLogger.info(`start for ${fooId}`, { fooId });

  const result = await deleteFooHandler(fooId, serviceLogger);

  if (result.isErr()) {
    response.status(HTTP_INTERNAL_SERVICE_ERROR_CODE).send(`Error deleting foo: ${result.error}`);
    return;
  }

  response.status(HTTP_SUCCESS_CODE).send();
}

/**
 *
 * @param parentLogger
 * @returns
 */
async function deleteFooHandler(
  externalId: string,
  parentLogger: Logger,
): Promise<Result<true, string>> {
  const { functionLogger } = createFunctionLogger('deleteFooHandler', parentLogger);

  functionLogger.debug(`start`);

  // Use the FSCollection directly to add this to Firestore
  // Use firestore helper class
  const fsHelper = FSCollectionConfig.partnerFoos('partner1');

  const findResult = await fsHelper.getSingleWithProperty('externalId', externalId);

  if (findResult.isErr()) {
    return err(`Unable to find foo: ${findResult.error}`);
  }

  const deleteResult = await fsHelper.delete(findResult.value.firestoreId);

  if (deleteResult.isErr()) {
    return err(`Unable to delete foo: ${deleteResult.error}`);
  }

  return ok(true);
}
