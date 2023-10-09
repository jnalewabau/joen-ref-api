import { Request } from 'express';
import { PartnerApiKey, PartnerInfo } from '../types/partnerInfo';

/**
 * Sets the external id for a partner into the response so later handlers can retrieve it
 * @param externalPartnerId The external partner id to store
 * @param resp The response to store the Partner Id in
 */
export function setPartnerAPIKeyInRequest(partnerKey: PartnerApiKey, req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).partnerKey = partnerKey;
}
/**
 * Retrieves the external partner ID of the partner from the response. If the ID is not found or not
 * the right type undefined is returned
 *
 * @param resp The response to get the external partner ID from
 */
export function getPartnerAPIKeyInRequest(req: Request): PartnerApiKey | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'partnerKey' in req ? ((req as any).partnerKey as PartnerApiKey) : undefined;
}

/**
 * Sets the partner into the response so later handlers can retrieve it
 * @param externalPartnerId The external partner id to store
 * @param resp The response to store the Partner Id in
 */
export function setPartnerInRequest(partner: PartnerInfo, req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).ExternalPartner = partner;
}
/**
 * Retrieves the partner from the response. If the ID is not found or not
 * the right type undefined is returned
 *
 * @param resp The response to get the external partner ID from
 */
export function getPartnerInRequest(req: Request): PartnerInfo | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'ExternalPartner' in req ? ((req as any).ExternalPartner as PartnerInfo) : undefined;
}
