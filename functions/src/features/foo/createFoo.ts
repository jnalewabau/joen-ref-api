import '../common/firebase/firestore/admin';
import { Request, Response } from 'express';
import { createServiceLogger } from '../common/logger/createServiceLogger';
import { createFunctionLogger } from '../common/logger/createFunctionLogger';

import { Result, err, ok } from 'neverthrow';
import { Logger } from 'winston';
import { Foo, FooSchema } from './foo';
import {
  HTTP_BAD_REQUEST_CODE,
  HTTP_INTERNAL_SERVICE_ERROR_CODE,
  HTTP_SUCCESS_CODE,
} from '../common/express/types/constants';
import { generateFooExternalId } from '../common/nano/nano';
import { FSCollectionConfig } from '../common/firebase/firestore/FSCollectionConfig';

/**
 *
 * @param request
 * @param response
 * @returns
 */
export async function createFoo(request: Request, response: Response) {
  const { serviceLogger } = createServiceLogger('createFoo');
  serviceLogger.info(`start`);

  // Validate the payload against expected schema
  serviceLogger.debug(`Request body: ${JSON.stringify(request.body, null, 2)}}`);

  const parseResult = FooSchema.safeParse(request.body);

  if (parseResult.success === false) {
    response.status(HTTP_BAD_REQUEST_CODE).send(`${parseResult.error.toString()}`);
    return;
  }

  const parsedData = parseResult.data;

  const result = await createFooHandler(parsedData, serviceLogger);

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
async function createFooHandler(
  fooToCreate: Foo,
  parentLogger: Logger,
): Promise<Result<string, string>> {
  const { functionLogger } = createFunctionLogger('createFooHandler', parentLogger);

  functionLogger.debug(`start create for ${fooToCreate}`);

  // Use firestore helper class
  const fsHelper = FSCollectionConfig.partnerFoos('partner1');
  const externalId = generateFooExternalId();
  fooToCreate.externalId = externalId;

  const addResult = await fsHelper.add(fooToCreate);

  if (addResult.isErr()) {
    return err(`Unable to add foo: ${addResult.error}`);
  }

  return ok(`Created foo: ${externalId}`);
}
