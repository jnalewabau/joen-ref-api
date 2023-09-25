import { FirestoreId } from './opaqueTypes';

export type WithFirestoreId<T> = T & { firestoreId: FirestoreId };
export type WithOutFirestoreId<T> = Omit<T, 'firestoreId'>;
