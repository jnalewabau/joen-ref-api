// Opaque creates a type alias based on a specific type and
// adds a __TYPE__ marker to make it distinct
export type Opaque<T, K> = T & { __TYPE__: K };

// FirestoreId represents the document identifier assigned by Firestore when it creates documents
export type FirestoreId = Opaque<string, 'FirestoreId'>;

// Factory method for FirestoreIds
export function makeFirestoreId(id: string) {
  return id as FirestoreId;
}
