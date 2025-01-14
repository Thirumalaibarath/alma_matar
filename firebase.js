const { admin,initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const decodedKey = Buffer.from(process.env.ALMA_MATER_KEY, 'base64').toString('utf8');
// to be used in serviceAccount variable 
//   require('./journalia-private-key.json')require('./journalia-private-key.json')
// JSON.parse(decodedKey);
const serviceAccount =  JSON.parse(decodedKey);
initializeApp({
  credential: cert(serviceAccount),
});

module.exports = {
  initializeApp,
  getFirestore,
  serviceAccount,
  admin,
};
