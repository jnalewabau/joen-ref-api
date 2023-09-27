export class CollectionNames {
  public static readonly partnerDataCollectionName = 'partnerData';
  public static readonly foo = 'foo';

  static partnerData(partnerDataId: string): string {
    return `${CollectionNames.partnerDataCollectionName}/${partnerDataId}`;
  }

  static partnerFooData(partnerDataId: string): string {
    return `${this.partnerData(partnerDataId)}/${CollectionNames.foo}`;
  }
}
