const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();
const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// Create a function that listens to the notification collection
// This function will create a cronjob which will execute
// computeThresholds at the specified starttime and days

// Create a function that will get the user's organization space thresholds and
// weather API data and then email or text the user

exports.sendNotifications = functions.runWith({ memory: '2GB' }).pubsub
  .schedule('* * * * *')
  .onRun(async () => {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const notifications = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDay = days[currentDate.getDay()];
    const query = db.collection('notifications');
    const notificationDocuments = await query.get();
    notificationDocuments.forEach((document) => {
      if (document.data().notifications) {
        document.data().notifications.forEach((notification) => {
          const {
            enabled, startDate, endDate, repeatDays, sendTime,
          } = notification;
          const repeatsToday = repeatDays.some((day) => day === currentDay);
          if (enabled && startDate && endDate && repeatsToday && sendTime) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            if (startTime < currentTime && endTime > currentTime) {
              notifications.push(notification);
            }
          }
        });
      }
    });
    functions.logger.log('Notifications', notifications);
    return null;
  });
