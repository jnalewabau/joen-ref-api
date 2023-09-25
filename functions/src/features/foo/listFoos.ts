import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';
import {
  HTTP_INTERNAL_SERVICE_ERROR_CODE,
  HTTP_SUCCESS_CODE,
} from '../common/express/types/constants';
import { Logger } from 'winston';
import { Result, err, ok } from 'neverthrow';
import { FSCollection } from '../common/firebase/firestore/FSCollectionSimple';
import { createFunctionLogger } from '../common/logger/createFunctionLogger';
import { Foo } from './foo';

export async function listFoos(request: Request, response: Response) {
  const { serviceLogger } = createServiceLogger('listFoos');
  serviceLogger.info(`start`);
  const result = await listFoosHandler(serviceLogger);

  if (result.isErr()) {
    response.status(HTTP_INTERNAL_SERVICE_ERROR_CODE).send(`Error listing foos: ${result.error}`);
    return;
  }

  response.status(HTTP_SUCCESS_CODE).send(result.value);
}

/**
 *
 * @param parentLogger
 * @returns
 */
async function listFoosHandler(
  parentLogger: Logger,
): Promise<Result<{ length: number; foos: Foo[] }, string>> {
  const { functionLogger } = createFunctionLogger('listFoosHandler', parentLogger);

  functionLogger.debug(`start list Foos`);

  // Use the FSCollection directly to add this to Firestore
  const fsHelper = new FSCollection<Foo>(`partnerData/partner1/foo`);

  const result = await fsHelper.getAll();

  if (result.isErr()) {
    return err(`Unable to list foos: ${result.error}`);
  }

  // Strip the firestoreId from the data returned
  const allFoods = result.value;
  const foosToReturn = allFoods.map((foo) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { firestoreId, ...dataToReturn } = foo;
    return dataToReturn;
  });

  return ok({
    length: foosToReturn.length,
    foos: foosToReturn,
  });
}
