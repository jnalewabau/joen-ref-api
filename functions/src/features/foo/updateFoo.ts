import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';
import { Result, err, ok } from 'neverthrow';
import { Logger } from 'winston';
import { FSCollection } from '../common/firebase/firestore/FSCollectionSimple';
import { createFunctionLogger } from '../common/logger/createFunctionLogger';
import { Foo, FooDeepPartial, FooDeepPartialSchema } from './foo';
import {
  HTTP_BAD_REQUEST_CODE,
  HTTP_INTERNAL_SERVICE_ERROR_CODE,
  HTTP_SUCCESS_CODE,
} from '../common/express/types/constants';

export async function updateFoo(request: Request, response: Response) {
  const fooId = request.params['id'];

  const { serviceLogger } = createServiceLogger('updateFoo');
  serviceLogger.info(`start for ${fooId}`, { fooId });

  const parseResult = FooDeepPartialSchema.safeParse(request.body);

  if (parseResult.success === false) {
    response.status(HTTP_BAD_REQUEST_CODE).send(`${parseResult.error.toString()}`);
    return;
  }

  const parsedData = parseResult.data;

  const result = await updateFooHandler(fooId, parsedData, serviceLogger);

  if (result.isErr()) {
    response.status(HTTP_INTERNAL_SERVICE_ERROR_CODE).send(`Error creating foo: ${result.error}`);
    return;
  }

  response.status(HTTP_SUCCESS_CODE).send(`Created foo: ${result.value}`);
}

/**
 *
 * @param parentLogger
 * @returns
 */
async function updateFooHandler(
  externalId: string,
  updates: FooDeepPartial,
  parentLogger: Logger,
): Promise<Result<true, string>> {
  const { functionLogger } = createFunctionLogger('updateFooHandler', parentLogger);

  functionLogger.debug(`start`);

  // Use the FSCollection directly to add this to Firestore
  const fsHelper = new FSCollection<Foo>(`partnerData/partner1/foo`);

  const findResult = await fsHelper.getSingleWithProperty('externalId', externalId);

  if (findResult.isErr()) {
    return err(`Unable to find foo: ${findResult.error}`);
  }

  const { firestoreId } = findResult.value;

  const updateResult = await fsHelper.update(firestoreId, updates);

  if (updateResult.isErr()) {
    return err(`Unable to update foo: ${updateResult.error}`);
  }

  return ok(true);
}
