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

function checkIfOpenable() {
  return null;
}

function sendNotification(notification) {
  const openable = checkIfOpenable();
  if (openable) {
    db.collection('notificationMessages').add({
      channelId: 'TEST_CHANNEL_ID',
      type: 'text',
      content: {
        text: 'Your window may be opened',
      },
      to: notification.phoneNumber,
    });
  }
}

exports.checkNotifications = functions.runWith({ memory: '2GB' }).pubsub
  .schedule('* * * * *')
  .onRun(async () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const hoursAndMinutes = `${padTo2Digits(currentDate.getHours())}:${padTo2Digits(currentDate.getMinutes())}`;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[currentDate.getDay()];
    const query = db.collection('notifications');
    const notificationDocuments = await query.get();
    notificationDocuments.forEach((document) => {
      if (document.data().notifications) {
        document.data().notifications.forEach((notification) => {
          const {
            enabled, startDate, endDate, repeatDays, UTCSendTime, phoneNumber,
          } = notification;
          const repeatsToday = repeatDays.some((day) => day === currentDay);
          if (enabled && startDate && endDate && repeatsToday && phoneNumber && UTCSendTime === hoursAndMinutes) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            if (startTime < timestamp && endTime > timestamp) {
              sendNotification(notification);
            }
          }
        });
      }
    });
    return null;
  });
