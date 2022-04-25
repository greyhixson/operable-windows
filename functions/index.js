const admin = require('firebase-admin');
const functions = require('firebase-functions');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

function getInputKey(input) {
  return input?.toLowerCase().replace(/\s+/g, '');
}

async function getOrg(orgName) {
  const orgKey = getInputKey(orgName);
  const orgRef = db.collection('organizations').doc(orgKey);
  const orgDoc = await orgRef.get();
  return orgDoc.data();
}

async function getAllSpaces(orgName) {
  const spaces = [];
  const orgKey = getInputKey(orgName);
  const querySnapshot = await db.collection(`organizations/${orgKey}/spaces`).get();
  querySnapshot.forEach((doc) => {
    spaces.push(doc.data());
  });
  return spaces;
}

async function deleteNotification(notifIndex, documentId) {
  const notificationRef = await db.collection('notifications').doc(documentId);
  const notificationDoc = await notificationRef.get();
  const notificationsObj = notificationDoc.data();
  if (notificationsObj.notifications) {
    const notifArray = notificationsObj.notifications;
    notifArray.splice(notifIndex, 1);
    await notificationRef.set({
      notifications: notifArray,
    });
  }

  return [];
}

async function getWeatherApiKey() {
  const apiRef = db.collection('keys').doc('openweathermap');
  const apiDoc = await apiRef.get();
  return apiDoc.data().api;
}

async function getWeather(city, state) {
  const trimCity = city.trim();
  const trimState = state.trim();
  const APIkey = await getWeatherApiKey();
  // eslint-disable-next-line max-len
  const request = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${trimCity},${trimState},US&appid=${APIkey}&units=imperial`);
  return request.data;
}

async function getAirPollution(lat, lon) {
  const APIkey = await getWeatherApiKey();
  // eslint-disable-next-line max-len
  const request = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}`);
  return request.data;
}

// Create a function that will get the user's organization space thresholds and
// weather API data and then email or text the user
function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}

function checkTemp(weather, space) {
  const { main: { temp } } = weather;
  const { minTemp, maxTemp } = space;
  return (temp >= minTemp) && (temp <= maxTemp);
}

function checkHumidity(weather, space) {
  const { main: { humidity } } = weather;
  const { maxHumidity } = space;
  return humidity <= maxHumidity;
}

function checkAirPollution(airPollution, space) {
  const { list: [{ main: { aqi } }] } = airPollution;
  const { maxAqi } = space;
  return aqi <= maxAqi;
}

async function checkIfOpenable(notification) {
  const { orgName, spaceName } = notification;
  const { city, state } = await getOrg(orgName);
  const spaces = await getAllSpaces(orgName);
  if (spaceName) {
    const matchedSpace = spaces.find((space) => space.name === spaceName);
    if (matchedSpace) {
      const weather = await getWeather(city, state);
      const { coord: { lat, lon } } = weather;
      const airPollution = await getAirPollution(lat, lon);
      const okTemp = checkTemp(weather, matchedSpace);
      const okHumidity = checkHumidity(weather, matchedSpace);
      const okAirPollution = checkAirPollution(airPollution, matchedSpace);
      if (okTemp && okHumidity && okAirPollution) {
        return true;
      }
    }
  }
  return false;
}

function sendTimeToUTC(sendTime, timezoneOffset) {
  const sendTimeSplit = sendTime.split(':');
  const newHours = (Number(sendTimeSplit[0]) + Number(timezoneOffset)) % 24;
  return `${padTo2Digits(newHours)}:${padTo2Digits(sendTimeSplit[1])}`;
}

function getCurrentDay(sendTime, timezoneOffset, date) {
  let currentDayIndex = date.getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sendTimeSplit = sendTime.split(':');
  const sendTimeHours = sendTimeSplit[0];
  if ((parseInt(sendTimeHours, 10) + parseInt(timezoneOffset, 10)) > 23) {
    currentDayIndex -= 1;
  } else if ((parseInt(sendTimeHours, 10) + parseInt(timezoneOffset, 10)) < 0) {
    currentDayIndex += 1;
  }
  return days[currentDayIndex];
}

async function sendNotification(notification) {
  const openable = await checkIfOpenable(notification);
  if (openable) {
    await db.collection('notificationMessages').add({
      message: 'Your window can be opened',
      notification,
    });
  }
}

exports.checkNotifications = functions.runWith({ memory: '2GB' }).pubsub
  .schedule('* * * * *')
  .onRun(async () => {
    const date = new Date();
    let timestamp = date.getTime();
    const hoursAndMinutes = `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`;
    const query = db.collection('notifications');
    const notificationDocuments = await query.get();
    notificationDocuments?.forEach((document) => {
      if (document.data().notifications) {
        document.data().notifications?.forEach(async (notification, notifIndex) => {
          const {
            enabled, startDate, endDate, repeatDays, sendTime, timezoneOffset, phoneNumber,
          } = notification;
          // Check if the notification has expired, and if the notification send date has started.
          const startTime = new Date(startDate).getTime();
          const endTime = new Date(endDate).getTime();
          timestamp += timezoneOffset * 3600000;
          if (endTime < timestamp) {
            await deleteNotification(notifIndex, document.id);
          } else if (startTime < timestamp && endTime > timestamp) {
            const UTCSendTime = sendTimeToUTC(sendTime, timezoneOffset);
            const currentDay = getCurrentDay(sendTime, timezoneOffset, date);
            const repeatsToday = repeatDays.some((day) => day === currentDay);
            if (enabled && startDate && endDate && repeatsToday && phoneNumber && UTCSendTime === hoursAndMinutes) {
              await sendNotification(notification);
            }
          }
        });
      }
    });
    return null;
  });
