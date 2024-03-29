import localforage from 'localforage'

localforage.config({
  driver: localforage.IndexedDb, // Force WebSQL; same as using setDriver()
  name: 'flashcards',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'topics', // Should be alphanumeric, with underscores.
  description: 'some description'
})

export default localforage