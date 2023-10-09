import { Request, Response, NextFunction } from 'express';

import { HTTP_INTERNAL_SERVICE_ERROR_CODE, HTTP_UNAUTHORIZED_CODE } from './types/constants';
import { createServiceLogger } from '../logger/createServiceLogger';
import { fetchPartnerWithKey } from './services/fetchPartnerWithKey';
import { setPartnerAPIKeyInRequest, setPartnerInRequest } from './utils/setPartnerInfoInRequest';

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

    const findPartnerCall = await fetchPartnerWithKey(req, xApiKey, serviceLogger);

    if (findPartnerCall.isErr()) {
      const error = findPartnerCall.error;
      return resp.status(HTTP_UNAUTHORIZED_CODE).send({
        message: error,
      });
    }
    const partnerInfo = findPartnerCall.value;

    serviceLogger.debug(`Found partner ${partnerInfo.name} for this API call`);

    // Check to see whether the key is still active
    const partnerKey = partnerInfo.apiKeys.find((key) => key.apiKey === xApiKey);

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

    // Store the partner information in the request so it can be used downstream
    setPartnerInRequest(partnerInfo, req);
    setPartnerAPIKeyInRequest(partnerKey, req);

    //   // Keep going down the middleware chain
    return next();
  } catch (error) {
    return resp.status(HTTP_INTERNAL_SERVICE_ERROR_CODE).send();
  }
}
