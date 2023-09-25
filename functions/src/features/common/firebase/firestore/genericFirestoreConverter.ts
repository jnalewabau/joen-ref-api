import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export class genericFirestoreConverter<T extends DocumentData>
  implements FirestoreDataConverter<T>
{
  toFirestore(data: T): DocumentData {
    return data;
  }
  fromFirestore(snapshot: QueryDocumentSnapshot): T {
    const data = snapshot.data() as T;
    return data;
  }
}
