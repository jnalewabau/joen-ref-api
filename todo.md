Todo

- Refactor foo type to have cleaner externalId WithFirestoreId
- [ ] WithoutFirestore - best way to omit things from a type Omit with Keys?
- [ ] Update with the dot syntax - https://javascript.plainenglish.io/using-firestore-with-more-typescript-8058b6a88674
- [ ] Add tests
- [ ] Look at how to use .gcloudignore - https://8thlight.com/insights/effective-use-and-debugging-of-gcloudignore-dockerignore-and-gitignore
      Done

- [x] CRUD API terms: e.g. fetch/get/read

Notes:

- .env files are supported natively - no need to directly load - https://firebase.google.com/docs/functions/config-env?gen=1st
- zod looks promising as a way to define on an objects schema and then infer the actual type
  - Deep partial allows a "update" object to be easily specified
