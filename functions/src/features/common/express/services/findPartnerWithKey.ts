import { Result, err, ok } from 'neverthrow';
import { Logger } from 'winston';
import { PartnerInfo } from '../types/partnerInfo';
import { Request } from 'express';
import { FSCollectionConfig } from '../../firebase/firestore/FSCollectionConfig';

/**
 * Find a partner with a specific partner key
 *
 * @param req
 * @param partnerKey
 */
export async function findPartnerWithKey(
  req: Request,
  partnerKey: string,
  logger: Logger,
): Promise<Result<PartnerInfo, string>> {
  // Find the partner with this key in Firestore and return it

  logger.debug(`Looking for a partner that matches key: ${partnerKey}`);

  // Get all the partners
  const fsHelper = FSCollectionConfig.partners();
  const getAllPartners = await fsHelper.getAll();

  if (getAllPartners.isErr()) {
    return err(getAllPartners.error.toString());
  }
  const allPartners = getAllPartners.value;

  logger.debug(`Potential partners: ${allPartners.length}`);

  // Find the partner with the key passed as part of the request
  const partner = allPartners.find((partner) => {
    const apiKey = partner.apiKeys.find((key) => key.apiKey === partnerKey);

    return apiKey !== undefined;
  });

  if (partner === undefined) {
    return err('No partner found with that key');
  }

  return ok(partner);
}

//   const allPartners: PartnerInfo[] = [
//     {
//       externalId: 'partner_123',
//       name: 'test',
//       apiKeys: [
//         {
//           disabled: false,
//           apiKey: 'apikey_123',
//           role: 'fully_trusted_partner',
//         },
//       ],
//     },
//   ];
