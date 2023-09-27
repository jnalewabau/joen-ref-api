import { FSCollection } from './FSCollectionSimple';
import { Foo } from '../../../foo/foo';
import { CollectionNames } from './collectionNames';

export class FSCollectionConfig {
  /**
   * Get access to the user collection
   */
  public static partnerFoos(partnerDataName: string): FSCollection<Foo> {
    return new FSCollection<Foo>(CollectionNames.partnerFooData(partnerDataName));
  }
}
