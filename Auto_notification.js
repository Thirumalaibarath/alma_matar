const cron = require('node-cron');
const { notification } = require('./notification'); 
const { getFirestore } = require('./firebase'); 
const db = getFirestore();

function autoNotification()
{
    const currentDate = new Date();
    console.log(currentDate.getMonth())

    cron.schedule('08 13 * * *', () => {
        console.log('Task is running at 12:00 PM');
        db.collection('Deadline_Announcement_Details').get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No deadlines found');
        return;
      }
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(data.details)
        // if (data.date == Tomorrow_Date ) {
        //     notification(title = doc.id ,body = data.description); 
        // }
      });
})
    .catch(err => {
      console.error('Error getting documents', err);
    });
    });
}
module.exports = {
    autoNotification
   };