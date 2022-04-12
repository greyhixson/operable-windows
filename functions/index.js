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
function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}

function sendNotification(notification) {
  db.collection('notificationMessages').add({
    channelId: '97f5ec10529c4982b18d3a92c09efbf3',
    type: 'text',
    content: {
      text: 'TEST MESSAGE',
    },
    to: notification.phoneNumber,
  });
}

exports.checkNotifications = functions.runWith({ memory: '2GB' }).pubsub
  .schedule('* * * * *')
  .onRun(async () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const hoursAndMinutes = `${padTo2Digits(currentDate.getHours())}:${padTo2Digits(currentDate.getMinutes())}`;
    const notifications = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDay = days[currentDate.getDay()];
    const query = db.collection('notifications');
    const notificationDocuments = await query.get();
    notificationDocuments.forEach((document) => {
      if (document.data().notifications) {
        document.data().notifications.forEach((notification) => {
          const {
            enabled, startDate, endDate, repeatDays, sendTime, phoneNumber,
          } = notification;
          const repeatsToday = repeatDays.some((day) => day === currentDay);
          functions.logger.log('Enabled', enabled);
          functions.logger.log('startDate', startDate);
          functions.logger.log('endDate', endDate);
          functions.logger.log('repeatsToday', repeatsToday);
          functions.logger.log('phoneNumber', phoneNumber);
          functions.logger.log('sendTime', sendTime);
          functions.logger.log('hoursAndMinutes', hoursAndMinutes);
          if (enabled && startDate && endDate && repeatsToday && phoneNumber && sendTime === hoursAndMinutes) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            new Date(sendTime).getTime();
            console.log(sendTime);
            if (startTime < timestamp && endTime > timestamp) {
              sendNotification(notification);
              notifications.push(notification);
            }
          }
        });
      }
    });
    functions.logger.log('Notifications', notifications);
    return null;
  });
