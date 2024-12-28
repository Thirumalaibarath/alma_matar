const { admin,initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./alma_matar.json');

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
