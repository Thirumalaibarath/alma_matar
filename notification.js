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
        tokens: tokens, // Send to all the retrieved FCM tokens
      };
    
      // Send message to the tokens
      admin.messaging().sendEachForMulticast(message)
        .then(response => {
          console.log(response.successCount + ' messages were sent successfully');
          // Handle the result as needed, e.g., log the failed tokens
          if (response.failureCount > 0) {
            console.log(response.responses); // Log failed response details
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
