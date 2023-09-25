import { err, ok, Result } from 'neverthrow';
import { db } from './admin';

import { DocumentData, UpdateData } from 'firebase-admin/firestore';
import { FSCollectionError } from './FSCollectionError';
import { FirestoreId, makeFirestoreId } from './opaqueTypes';
import { WithFirestoreId } from './withFirestoreId';
import { genericFirestoreConverter } from './genericFirestoreConverter';

export class FSCollection<T extends DocumentData> {
  private converter: FirebaseFirestore.FirestoreDataConverter<T>;

  constructor(
    public collectionName: string,
    converter?: FirebaseFirestore.FirestoreDataConverter<T>,
  ) {
    this.converter = converter ?? new genericFirestoreConverter<T>();
  }

  /**
   * Adds a document to the collection
   */
  async add(obj: T): Promise<Result<FirestoreId, FSCollectionError>> {
    try {
      const docRef = await db
        .collection(this.collectionName)
        .withConverter(this.converter)
        .add(obj);

      return ok(makeFirestoreId(docRef.id));
    } catch (error) {
      return err(FSCollectionError.generateFSCollectionError(error));
    }
  }

  /**
   * gets a document from the collection
   */
  async get(firestoreId: FirestoreId): Promise<Result<WithFirestoreId<T>, FSCollectionError>> {
    try {
      const docRef = await db
        .collection(this.collectionName)
        .withConverter(this.converter)
        .doc(firestoreId)
        .get();

      return ok({ ...(docRef.data() as T), firestoreId });
    } catch (error) {
      return err(FSCollectionError.generateFSCollectionError(error));
    }
  }

  /**
   * Updates a document
   */
  async update(
    firestoreId: FirestoreId,
    updatesToMake: Partial<T>,
  ): Promise<Result<true, FSCollectionError>> {
    try {
      const path = this.getDocumentPath(firestoreId);

      const snap = await db.doc(path).withConverter(this.converter).get();
      if (snap.exists) {
        const updateData = updatesToMake as UpdateData<T>;
        await db.doc(path).withConverter(this.converter).update(updateData);
        return ok(true);
      }
      return err(new FSCollectionError('id-not-found'));
    } catch (error) {
      return err(FSCollectionError.generateFSCollectionError(error));
    }
  }

  /**
   * Deletes a document
   */
  async delete(firestoreId: FirestoreId): Promise<Result<true, FSCollectionError>> {
    try {
      const path = this.getDocumentPath(firestoreId);

      const snap = await db.doc(path).get();
      if (snap.exists) {
        await db.doc(path).delete();
        return ok(true);
      }
      return err(new FSCollectionError('id-not-found'));
    } catch (error) {
      return err(FSCollectionError.generateFSCollectionError(error));
    }
  }

  /**
   * Returns all documents in the collection (with their FirestoreId)
   * @returns True if the document exists, or a CollectionHelperError
   */
  async getAll(): Promise<Result<WithFirestoreId<T>[], FSCollectionError>> {
    try {
      const snap = await db.collection(this.collectionName).withConverter(this.converter).get();

      if (snap.size > 0) {
        const allDocs = snap.docs.map((doc) => {
          return {
            ...(doc.data() as T),
            firestoreId: makeFirestoreId(doc.id),
          };
        });

        return ok(allDocs);
      }

      return ok([]);
    } catch (error) {
      return err(FSCollectionError.generateFSCollectionError(error));
    }
  }

  /**
   * Returns the document data if it exists
   * @param externalId  External ID
   * @returns True if the document exists, or a CollectionHelperError
   */
  async getSingleWithProperty<K extends keyof T>(
    key: K,
    value: T[K],
  ): Promise<Result<WithFirestoreId<T>, FSCollectionError>> {
    try {
      const snap = await db
        .collection(this.collectionName)
        .withConverter(this.converter)
        .where(key.toString(), '==', value)
        .get();

      if (snap.size === 0) {
        // We have no investments that match
        return err(new FSCollectionError('property-not-found'));
      }

      if (snap.size > 1) {
        return err(new FSCollectionError('multiple-docs-found'));
      }

      // We have a single document so cast into type
      const data = snap.docs[0].data() as T;

      // Add the firestoreId
      const dataWithId: WithFirestoreId<T> = {
        ...data,
        firestoreId: makeFirestoreId(snap.docs[0].id),
      };

      return ok(dataWithId);
    } catch (error) {
      return err(FSCollectionError.generateFSCollectionError(error));
    }
  }
  /**
   * Return the document path inside this collection
   * @param {string} id The document id
   * @return {string} The document path to an object in this collection
   */
  public getDocumentPath(id: string): string {
    return `${this.collectionName}/${id}`;
  }
}
