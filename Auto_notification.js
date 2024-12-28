const cron = require('node-cron');
const { notification } = require('./notification'); 
const { getFirestore } = require('./firebase'); 
const db = getFirestore();

function autoNotification()
{
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const Tomorrow_Date = currentDate.toISOString().split('T')[0];
    console.error(Tomorrow_Date);
    cron.schedule('24 23 * * *', () => {
        console.log('Task is running at 12:00 PM');
        db.collection('admin_deadlines').get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No deadlines found');
        return;
      }
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(data.date+" "+Tomorrow_Date)
        if (data.date == Tomorrow_Date ) {
            notification(title = doc.id ,body = data.description); 
        }
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