const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./alma-matar-9089fe8b42ae.json');

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const addStudent = async (collectionName, documentName, data) => {
  try {
    const docRef = db.collection(collectionName).doc(documentName);
    await docRef.set(data);
    console.log(`Document '${documentName}' added successfully to '${collectionName}'!`);
  } catch (error) {
    console.error('Error adding document:', error);
  }
};
module.exports = {
  db,
  addStudent,
};