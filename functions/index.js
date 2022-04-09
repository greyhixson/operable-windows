const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// Create a function that listens to the notification collection
// This function will create a cronjob which will execute
// computeThresholds at the specified starttime and days

// Create a function that will get the user's organization space thresholds and
// weather API data and then email or text the user

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
