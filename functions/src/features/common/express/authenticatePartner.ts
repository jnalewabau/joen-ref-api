import { Request, Response, NextFunction } from 'express';

import { Result, ok } from 'neverthrow';
import { PartnerInfo } from './types/partnerInfo';
import { HTTP_INTERNAL_SERVICE_ERROR_CODE, HTTP_UNAUTHORIZED_CODE } from './types/constants';
import { createServiceLogger } from '../logger/createServiceLogger';
import { Logger } from 'winston';

/**
 * Authenticates that a call to an API is allowed for a partner - partners
 * must pass in their api key in the request header via x-api-key
 *
 * @param req
 * @param resp
 * @param next
 * @returns
 */
export async function authenticatePartner(req: Request, resp: Response, next: NextFunction) {
  const { serviceLogger } = createServiceLogger(`authenticatePartnerKey`);

  try {
    // Get the API key from x-api-key Token
    const xApiKey = req.header('x-api-key') as string;

    if (!xApiKey) {
      serviceLogger.error(`authentication failed: No x-api-key in header`);
      return resp.status(HTTP_UNAUTHORIZED_CODE).send();
    }

    const findPartnerCall = await findPartnerWithKey(req, xApiKey, serviceLogger);

    if (findPartnerCall.isErr()) {
      const error = findPartnerCall.error;
      return resp.status(HTTP_UNAUTHORIZED_CODE).send({
        message: error,
      });
    }
    const partnerInfo = findPartnerCall.value;

    serviceLogger.debug(`Found partner ${partnerInfo.name} for this API call`);

    // Check to see whether the key is still active
    const partnerKey = partnerInfo.apiAccess.find((apiAccess) => apiAccess.apiKey === xApiKey);

    if (!partnerKey) {
      return resp.status(HTTP_UNAUTHORIZED_CODE).send({
        message: 'API key is not valid',
      });
    }

    if (partnerKey.disabled === true) {
      serviceLogger.warn('Call to Partner API with a disabled partner API key');

      return resp.status(HTTP_UNAUTHORIZED_CODE).send({
        message: 'API key has been disabled',
      });
    }

    // Check to see the partner can call the API based on the role associated
    // with the API key

    // Store the partner information in the request so it can be used downstream

    //   // Keep going down the middleware chain
    return next();
  } catch (error) {
    return resp.status(HTTP_INTERNAL_SERVICE_ERROR_CODE).send();
  }
}

/**
 * Express middleware that checks to see if we can identify the partner calling
 * an API.
 *
 * @param req
 * @param partnerKey
 */
export async function findPartnerWithKey(
  req: Request,
  partnerKey: string,
  logger: Logger,
): Promise<Result<PartnerInfo, string>> {
  logger.debug(`Find partner with key - ${partnerKey}`);

  return ok({
    partnerId: 'partner_123',
    name: 'test',
    apiAccess: [
      {
        disabled: false,
        apiKey: 'apikey_123',
        role: 'fully-trusted-partner',
      },
    ],
  });
}

//   const rf = new UpstreetResponseFactory(fnLogger, functionName);
//   // Get all the partner API keys in the system
//   const partnerAPIKeys = await getPartnerIdsAndKeys(fnLogger);
//   // Do we have a partner with the API key passed in?
//   const validPartner = partnerAPIKeys.find((info) => info.partnerApiKey === partnerKey);
//   // If there is not valid partner then fail
//   if (!validPartner) {
//     fnLogger.error(`authentication failed: Partner key not recognized ${partnerKey}`, {
//       partnerKey,
//     });
//     return rf.unauthorized(`Partner key ${partnerKey} not recognized`);
//   }
//   const partnerId = validPartner.partnerId;
//   // Get the Partners information
//   const partnerDetailsCall = await getUpstreetPartner(partnerId, fnLogger);
//   if (partnerDetailsCall.isErr()) {
//     fnLogger.error(`authentication failed: Partner details not found in firebase ${partnerId}`, {
//       partnerId,
//     });
//     return rf.internalServiceError();
//   }
//   const partnerDetails = partnerDetailsCall.value;
//   // Log the fact that a partner is making a call
//   fnLogger.debug(
//     `Partner ${partnerId}-${partnerDetails.name} is attempting to call API ${req.method}-${req.path}`,
//     {
//       validPartner,
//     },
//   );
//   // Test to see whether the Partner can access thr API they are calling
//   const canAccessCall = await canPartnerAccessEndpoint(req, partnerDetails, fnLogger);
//   if (canAccessCall.isErr()) {
//     const error = canAccessCall.error;
//     if (error === 'no-api-for-endpoint') {
//       // Must be no permission
//       fnLogger.error(
//         `Partner ${partnerDetails.name} is calling an unknown api endpoint : ${req.path}`,
//         {
//           partnerDetails,
//           path: req.path,
//         },
//       );
//       return rf.badRequest(`Calling an unknown Upstreet API endpoint : ${req.path}`);
//     }
//     // Must be no permission
//     fnLogger.error(`Partner ${partnerDetails.name} does not have access to request : ${req.path}`, {
//       partnerDetails,
//       path: req.path,
//     });
//     return rf.unauthorized();
//   }
//   const grantedApiCall = canAccessCall.value;
//   // Log an approval for an API call
//   fnLogger.debug(`Partner ${partnerId} has permission for ${grantedApiCall}`, {
//     validPartner,
//     grantedApiCall,
//   });
//   return rf.okWithData<PartnerId>(partnerId);
// }
