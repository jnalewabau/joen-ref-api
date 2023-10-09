import { Result, err, ok } from 'neverthrow';
import { PartnerInfo } from '../types/partnerInfo';
import { FSCollectionConfig } from '../../firebase/firestore/FSCollectionConfig';

/**
 * Find a partner with a specific partner key
 *
 * @param req
 * @param partnerKey
 */
export async function fetchPartnerWithExternalId(
  partnerExternalId: string,
): Promise<Result<PartnerInfo, string>> {
  const fsHelper = FSCollectionConfig.partners();
  const fetchPartnerCall = await fsHelper.getSingleWithProperty('externalId', partnerExternalId);

  if (fetchPartnerCall.isErr()) {
    return err(fetchPartnerCall.error.toString());
  }
  const partner = fetchPartnerCall.value;

  return ok(partner);
}
