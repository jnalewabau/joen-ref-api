import { Request, Response, NextFunction } from 'express';

import { HTTP_INTERNAL_SERVICE_ERROR_CODE, HTTP_UNAUTHORIZED_CODE } from './types/constants';
import { createServiceLogger } from '../logger/createServiceLogger';
import { getLogicalEndpointNameFor } from './utils/getLogicalEndpointNameFor';
import { getPartnerAPIKeyInRequest, getPartnerInRequest } from './utils/setPartnerInfoInRequest';
import { doesRoleHavePermissionToAccessEndpoint } from './utils/doesRoleHavePermissionToAccessEndpoint';

/**
 * Checks to see whether the partner is authorized to make this call
 * @param req
 * @param resp
 * @param next
 * @returns
 */
export async function authorizePartner(req: Request, resp: Response, next: NextFunction) {
  const { serviceLogger } = createServiceLogger(`authorizePartner`);

  // Get the partner for this request so we can validate it's role
  const partner = getPartnerInRequest(req);
  const partnerKey = getPartnerAPIKeyInRequest(req);

  if (partnerKey === undefined || partner === undefined) {
    serviceLogger.debug(
      `No external partner or partner key found for this request - (middleware order issue?)`,
    );

    return resp.status(HTTP_UNAUTHORIZED_CODE).send();
  }

  try {
    serviceLogger.debug(`Found partner ${partner.name} role "${partnerKey.role}" for api key used`);
    // Get the logical name for the end point
    const { method, path } = req;
    const getEndpointNameCall = getLogicalEndpointNameFor(method, path, serviceLogger);
    if (getEndpointNameCall.isErr()) {
      return resp.status(HTTP_UNAUTHORIZED_CODE).send({
        message: 'No defined API endpoint found ',
      });
    }
    const logicalEndpoint = getEndpointNameCall.value;

    serviceLogger.debug(`Logical API Endpoint ${logicalEndpoint}`);

    const permissionToCallEndpoint = await doesRoleHavePermissionToAccessEndpoint(
      partnerKey,
      logicalEndpoint,
      serviceLogger,
    );

    serviceLogger.debug(
      `Partner ${partner.name} can access ${logicalEndpoint}? ${permissionToCallEndpoint}`,
      {
        logicalEndpoint,
        permissionToCallEndpoint,
      },
    );

    if (permissionToCallEndpoint === false) {
      return resp.status(HTTP_UNAUTHORIZED_CODE).send({
        message: 'Partner key is not authorized to access this endpoint',
      });
    }

    return next();
  } catch (error) {
    return resp.status(HTTP_INTERNAL_SERVICE_ERROR_CODE).send();
  }
}
