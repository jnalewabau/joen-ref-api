// import * as admin from 'firebase-admin';
// import { err, ok, Result } from 'neverthrow';
// import { Logger } from 'winston';
// import { FirestoreId, makeFirestoreId } from './opaqueTypes';
// import { db } from './admin';
// import { DocumentData } from 'firebase-admin/firestore';
// import { FSCollectionError } from './FSCollectionError';
// /**
//  * The list of errors that can be generated from @CollectionHelper
//  */

// // Type that allows us to add a Firestore Id to any other type
// export type WithFirestoreId<T> = T & { firestoreId: FirestoreId };

// export type OrderByDirection = 'asc' | 'desc';
// export class FSCollection<T extends admin.firestore.DocumentData> {
//   constructor(
//     public collectionName: string,
//     protected logger?: Logger,
//   ) {
//     logger?.silly(`Creating FSCollection for ${collectionName}`);
//   }

//   /**
//    * Adds a document to the collection
//    * @param id ID of the document
//    * @returns the id of the created document, or a CollectionHelperError
//    */
//   async add(obj: T): Promise<Result<string, FSCollectionError>> {
//     try {
//       this.logger?.silly(`FSCollection::add`, { obj });

//       const docRef = await db.collection(this.collectionName).add(obj);
//       return ok(docRef.id);
//     } catch (error) {
//       if (error instanceof Error) {
//         return err(new FSCollectionError('firebase-exception', error));
//       }
//       return err(new FSCollectionError('firebase-exception'));
//     }
//   }

//   /**
//    * Returns the document data if it exists
//    * @param id ID of the document
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async addWithId(obj: T, id: string): Promise<Result<true, FSCollectionError>> {
//     try {
//       const path = this.getDocumentPath(id);

//       this.logger?.silly(`FSCollection::addWithId - path ${path}`, { obj, id });
//       const snap = await db.doc(path).get();

//       if (snap.exists) {
//         return err(new FSCollectionError('id-already-exists'));
//       }

//       await db.doc(path).set(obj);
//       return ok(true);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns true if the document exists
//    * @param id ID of the document
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async exist(id: string): Promise<Result<true, FSCollectionError>> {
//     try {
//       const path = this.getDocumentPath(id);
//       this.logger?.silly(`FSCollection::exist. path = ${path}`, { path });

//       const snap = await db.doc(path).get();
//       if (snap.exists) {
//         return ok(true);
//       }
//       return err(new FSCollectionError('id-not-found'));
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error.toString()));
//     }
//   }

//   /**
//    * Returns true if the document exists
//    * @param id ID of the document
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async singleExistWithProperty<K extends keyof T>(
//     key: K,
//     value: T[K],
//   ): Promise<Result<true, FSCollectionError>> {
//     try {
//       this.logger?.silly(`FSCollection::existWithProperty ${key}-${value}`, { key, value });

//       const snap = await db
//         .collection(this.collectionName)
//         .where(key.toString(), '==', value)
//         .get();

//       if (snap.size === 0) {
//         // We have no investments that match
//         return err(new FSCollectionError('property-not-found'));
//       }

//       if (snap.size > 1) {
//         return err(new FSCollectionError('multiple-docs-found'));
//       }

//       return ok(true);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns the document data if it exists
//    * @param id ID of the document
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async get(id: string): Promise<Result<T, FSCollectionError>> {
//     try {
//       const path = this.getDocumentPath(id);
//       this.logger?.silly(`FSCollection::get. path = ${path}`, { path });

//       const snap = await db.doc(path).get();
//       if (snap.exists) {
//         return ok(snap.data() as T);
//       }
//       return err(new FSCollectionError('id-not-found'));
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns the document data if it exists along with a FirestoreId
//    * @param id ID of the document
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async getWithId(id: string): Promise<Result<WithFirestoreId<T>, FSCollectionError>> {
//     const rawGetCall = await this.get(id);

//     if (rawGetCall.isErr()) {
//       return err(rawGetCall.error);
//     }

//     return ok({ ...rawGetCall.value, firestoreId: makeFirestoreId(id) });
//   }
//   /**
//    * Returns the document data if it exists
//    * @param key  property to get
//    * @param value  value of property to get
//    * @returns list of documents that have the given property, or a CollectionHelperError
//    */
//   async getWithProperty<K extends keyof T>(
//     key: K,
//     value: T[K],
//   ): Promise<Result<T[], FSCollectionError>> {
//     try {
//       this.logger?.silly(`FSCollection::getWithProperty ${key}-${value}`, { key, value });

//       const snap = await db
//         .collection(this.collectionName)
//         .where(key.toString(), '==', value)
//         .get();

//       if (snap.size > 0) {
//         const allDocs = snap.docs.map((doc) => doc.data() as T);
//         return ok(allDocs);
//       }

//       return ok([]);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns the document data (with the firestoreId) if it exists
//    * @param key  property to get
//    * @param value  value of property to get
//    * @returns list of documents that have the given property, or a CollectionHelperError
//    */
//   async getAllWithPropertyAndId<K extends keyof T>(
//     key: K,
//     value: T[K],
//   ): Promise<Result<WithFirestoreId<T>[], FSCollectionError>> {
//     try {
//       this.logger?.silly(`FSCollection::getWithProperty ${key}-${value}`, { key, value });

//       const snap = await db
//         .collection(this.collectionName)
//         .where(key.toString(), '==', value)
//         .get();

//       if (snap.size > 0) {
//         const allDocs = snap.docs.map((doc) => {
//           return { ...(doc.data() as T), firestoreId: makeFirestoreId(doc.id) };
//         });
//         return ok(allDocs);
//       }

//       return ok([]);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns the list of sorted documents that have the given property
//    * @param key  property to get
//    * @param value  value of property to get
//    * @param sortKey  property to sort
//    * @param sortOrder  order to sort
//    * @returns list of sorted documents that have the given property, or a CollectionHelperError
//    */
//   async getWithSortedProperty<K extends keyof T, N extends keyof T>(
//     key: K,
//     value: T[K],
//     sortKey: N,
//     sortOrder: OrderByDirection,
//   ): Promise<Result<T[], FSCollectionError>> {
//     try {
//       this.logger?.silly(
//         `FSCollection::getWithSortedProperty ${key}-${value} sorted by ${sortKey}-${sortOrder}`,
//         { key, value, sortKey, sortOrder },
//       );

//       const snap = await db
//         .collection(this.collectionName)
//         .orderBy(sortKey.toString(), sortOrder)
//         .where(key.toString(), '==', value)
//         .get();

//       if (snap.size > 0) {
//         const allDocs = snap.docs.map((doc) => doc.data() as T);
//         return ok(allDocs);
//       }

//       return ok([]);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns the document data if it exists
//    * @param externalId  External ID
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async getSingleWithProperty<K extends keyof T>(
//     key: K,
//     value: T[K],
//   ): Promise<Result<WithFirestoreId<T>, FSCollectionError>> {
//     try {
//       this.logger?.silly(`FSCollection::getSingleWithProperty ${key}-${value}`, { key, value });

//       const snap = await db
//         .collection(this.collectionName)
//         .where(key.toString(), '==', value)
//         .get();

//       if (snap.size === 0) {
//         // We have no investments that match
//         return err(new FSCollectionError('property-not-found'));
//       }

//       if (snap.size > 1) {
//         return err(new FSCollectionError('multiple-docs-found'));
//       }

//       // We have a single document so cast into type
//       const data = snap.docs[0].data() as T;

//       // Add the firestoreId
//       const dataWithId: WithFirestoreId<T> = {
//         ...data,
//         firestoreId: makeFirestoreId(snap.docs[0].id),
//       };

//       return ok(dataWithId);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns limited amount of documents in the collection
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async getWithOffsetLimitAndId(
//     offset: number,
//     limit: number,
//   ): Promise<Result<WithFirestoreId<T>[], FSCollectionError>> {
//     try {
//       const snap = await db.collection(this.collectionName).offset(offset).limit(limit).get();

//       if (snap.size > 0) {
//         const allDocs = snap.docs.map((doc) => {
//           return {
//             ...(doc.data() as T),
//             firestoreId: makeFirestoreId(doc.id),
//           };
//         });
//         return ok(allDocs);
//       }

//       return ok([]);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns limited amount of documents in the collection
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async getWithArrayContainsAny<K extends keyof T>(
//     key: K,
//     value: T[K],
//   ): Promise<Result<T[], FSCollectionError>> {
//     try {
//       const snap = await db
//         .collection(this.collectionName)
//         .where(key.toString(), 'array-contains-any', value)
//         .get();

//       if (snap.size > 0) {
//         const allDocs = snap.docs.map((doc) => doc.data() as T);
//         return ok(allDocs);
//       }

//       return ok([]);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns all documents in the collection
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async getAll(): Promise<Result<T[], FSCollectionError>> {
//     try {
//       const snap = await db.collection(this.collectionName).get();

//       if (snap.size > 0) {
//         const allDocs = snap.docs.map((doc) => doc.data() as T);
//         return ok(allDocs);
//       }

//       return ok([]);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns all documents in the collection (with their FirestoreId)
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async getAllWithId(): Promise<Result<WithFirestoreId<T>[], FSCollectionError>> {
//     try {
//       const snap = await db.collection(this.collectionName).get();

//       if (snap.size > 0) {
//         const allDocs = snap.docs.map((doc) => {
//           return {
//             ...(doc.data() as T),
//             firestoreId: makeFirestoreId(doc.id),
//           };
//         });

//         return ok(allDocs);
//       }

//       return ok([]);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns the document data if it exists
//    * @param id ID of the document
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async update(id: string, updatesToMake: Partial<T>): Promise<Result<true, FSCollectionError>> {
//     try {
//       const path = this.getDocumentPath(id);
//       this.logger?.silly(`FSCollection::update. path = ${path}`, { path, updatesToMake });

//       const snap = await db.doc(path).get();
//       if (snap.exists) {
//         await db.doc(path).update(updatesToMake);
//         return ok(true);
//       }
//       return err(new FSCollectionError('id-not-found'));
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * !IMPORTANT: this function will error out if more than 500 docs are found
//    *
//    * Updates all documents in the collection that match the comparison criteria
//    * @param updatesToMake Updates to make to the document
//    * @param key Key to compare
//    * @param opStr firestore where operator (e.g. '==', '>', '<', '>=', '<=')
//    * @param value Value to compare
//    * @returns True if the updates were successful, or a CollectionHelperError
//    */
//   async updateAllWhere<K extends keyof T>(
//     updatesToMake: Partial<T>,
//     key: K,
//     opStr: FirebaseFirestore.WhereFilterOp,
//     value: T[K],
//   ): Promise<Result<true, FSCollectionError>> {
//     try {
//       const path = this.collectionName;
//       this.logger?.silly(`FSCollection::updateAllWhere path = ${path}`, { path, updatesToMake });

//       const snap = await db
//         .collection(this.collectionName)
//         .where(key.toString(), opStr, value)
//         .get();

//       const batch = db.batch();

//       snap.docs.forEach((doc) => {
//         batch.update(doc.ref, updatesToMake);
//       });

//       await batch.commit();

//       return ok(true);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Creates the document if it does not already exists and updates it if it does
//    * @param id ID of the document
//    * @param dataToSet Data used to create or update the document
//    * @returns True if the data was set, or a CollectionHelperError
//    */
//   async set(id: string, dataToSet: Partial<T>): Promise<Result<true, FSCollectionError>> {
//     try {
//       const path = this.getDocumentPath(id);
//       this.logger?.silly(`FSCollection::set. path = ${path}`, { path, dataToSet });

//       await db.doc(path).set(dataToSet, { merge: true });
//       return ok(true);
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Returns the document data if it exists
//    * @param id ID of the document
//    * @returns True if the document exists, or a CollectionHelperError
//    */
//   async delete(id: string): Promise<Result<true, FSCollectionError>> {
//     try {
//       const path = this.getDocumentPath(id);
//       this.logger?.silly(`FSCollection::delete. path = ${path}`, { path });

//       const snap = await db.doc(path).get();
//       if (snap.exists) {
//         await db.doc(path).delete();
//         return ok(true);
//       }
//       return err(new FSCollectionError('id-not-found'));
//     } catch (error) {
//       return err(new FSCollectionError('firebase-exception', error));
//     }
//   }

//   /**
//    * Return the document path inside this collection
//    * @param {string} id The document id
//    * @return {string} The document path to an object in this collection
//    */
//   public getDocumentPath(id: string): string {
//     return `${this.collectionName}/${id}`;
//   }
// }
