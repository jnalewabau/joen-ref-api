export type FSCollectionErrorType =
  | 'id-not-found'
  | 'property-not-found'
  | 'id-already-exists'
  | 'multiple-docs-found'
  | 'firebase-exception';

export interface FSCollectionErrorParams {
  error?: Error;
  additionalDetails?: string;
}
export class FSCollectionError {
  constructor(
    public errorType: FSCollectionErrorType,
    public details?: FSCollectionErrorParams,
  ) {}

  /**
   * @return {string} string representation
   */
  public toString(): string {
    if (this.details) {
      if (this.details.error) {
        return `${this.errorType} - ${this.details.error}`;
      }
      if (this.details.additionalDetails) {
        return `${this.errorType} - ${this.details.additionalDetails}`;
      }
    }
    return `${this.errorType}`;
  }

  static generateFSCollectionError(error: unknown): FSCollectionError {
    if (error instanceof Error) {
      return new FSCollectionError('firebase-exception', { error: error });
    }

    const objectString = JSON.stringify(error);
    return new FSCollectionError('firebase-exception', { additionalDetails: objectString });
  }
}
