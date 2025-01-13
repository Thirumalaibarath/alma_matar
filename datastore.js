const { getFirestore } = require('./firebase'); 
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
const getCalendarDetails = async (documentName) => {
  try {
    const docRef = db.collection("student_custom_reminder").doc(documentName);
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      console.log(`Document '${documentName}' data:`, docSnapshot.data());
      return docSnapshot.data();
    } else {
      console.log(`No document found with the name '${documentName}' in collection '${collectionName}'.`);
      return null; 
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error; 
};
}

module.exports = {
  db,
  addStudent,
  getCalendarDetails
};