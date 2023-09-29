import { FSCollection } from './FSCollectionSimple';
import { Foo } from '../../../foo/foo';
import { CollectionNames } from './collectionNames';
import { PartnerInfo } from '../../express/types/partnerInfo';

export class FSCollectionConfig {
  /**
   * Get access to the partners Foo collection
   */
  public static partnerFoos(partnerDataName: string): FSCollection<Foo> {
    return new FSCollection<Foo>(CollectionNames.partnerFooData(partnerDataName));
  }
  /**
   * Get access to the partners
   */
  public static partners(): FSCollection<PartnerInfo> {
    return new FSCollection<PartnerInfo>(CollectionNames.partners);
  }
}
