const { admin,initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

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
