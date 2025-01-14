const admin = require('firebase-admin');
const { getFirestore } = require('./firebase'); 
const db = getFirestore();

function notification(title,body)
{
    db.collection('students').get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No users found');
        return;
      }
      let tokens = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.FCM_token) {
          tokens.push(data.FCM_token); 
        }
      });
      console.log(tokens);
      const message = {
        notification: {
          title: title,
          body: body,
        },
        tokens: tokens, 
      };
  
      admin.messaging().sendEachForMulticast(message)
        .then(response => {
          console.log(response.successCount + ' messages were sent successfully');
          if (response.failureCount > 0) {
            console.log(response.responses);
          }
        })
        .catch(error => {
          console.log('Error sending message:', error);
        });
    })
    .catch(err => {
      console.error('Error getting documents', err);
    });
}


module.exports = {
   notification
  };
