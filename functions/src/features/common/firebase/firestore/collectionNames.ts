export class CollectionNames {
  public static readonly partnerDataCollectionName = 'partnerData';
  public static readonly foo = 'foo';
  public static readonly partners = 'partners';

  static partnerData(partnerDataId: string): string {
    return `${CollectionNames.partnerDataCollectionName}/${partnerDataId}`;
  }

  static partnerFooData(partnerDataId: string): string {
    return `${this.partnerData(partnerDataId)}/${CollectionNames.foo}`;
  }
}
