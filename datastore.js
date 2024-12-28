const { getFirestore } = require('./firebase'); 
const db = getFirestore();
const { Firestore } = require('@google-cloud/firestore');
const session = require('express-session');

const addStudent = async (collectionName, documentName, data) => {
  try {
    const docRef = db.collection(collectionName).doc(documentName);
    await docRef.set(data);
    console.log(`Document '${documentName}' added successfully to '${collectionName}'!`);
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

class FirestoreStore extends session.Store {
  constructor(options = {}) {
    super();
    this.firestore = new Firestore();
    this.collection = this.firestore.collection(options.collection || 'sessions');
    this.ttl = options.ttl || 3600; // Time-to-live in seconds
  }

  // Get a session by ID
  async get(sid, callback) {
    try {
      const doc = await this.collection.doc(sid).get();
      if (!doc.exists) {
        return callback(null, null);
      }
      const session = doc.data();
      callback(null, session.data);
    } catch (err) {
      callback(err);
    }
  }

  // Save a session
  async set(sid, session, callback) {
    try {
      const expires = new Date(Date.now() + this.ttl * 1000);
      await this.collection.doc(sid).set({ data: session, expires });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  // Destroy a session
  async destroy(sid, callback) {
    try {
      await this.collection.doc(sid).delete();
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  // Clear expired sessions
  async clearExpiredSessions() {
    const now = new Date();
    const snapshot = await this.collection.where('expires', '<', now).get();
    const batch = this.firestore.batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  // (Optional) Clear all sessions
  async clear(callback) {
    try {
      const snapshot = await this.collection.get();
      const batch = this.firestore.batch();
      snapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}


module.exports = {
  db,
  addStudent,
  FirestoreStore
};