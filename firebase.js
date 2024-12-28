const { admin,initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const decodedKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decodedKey);

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
});


module.exports = {
  initializeApp,
  getFirestore,
  serviceAccount,
  admin,
};
