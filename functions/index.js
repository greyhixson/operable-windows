const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();
const db = admin.firestore();

function getInputKey(input) {
  return input?.toLowerCase().replace(/\s+/g, '');
}

async function getOrg(orgName) {
  functions.logger.log('Start getOrg ');
  const orgKey = getInputKey(orgName);
  const orgRef = doc(db, 'organizations', orgKey);
  const orgDoc = await getDoc(orgRef);
  if (orgDoc.exists()) {
    functions.logger.log('End getOrg ', orgDoc.data());
    return orgDoc.data();
  }
  return null;
}

async function getAllSpaces(orgName) {
  functions.logger.log('In getAllSpaces: ');
  const spaces = [];
  const orgKey = getInputKey(orgName);
  const querySnapshot = await getDocs(collection(db, `organizations/${orgKey}/spaces`));
  querySnapshot.forEach((document) => {
    spaces.push(document.data());
  });
  functions.logger.log('End getAllSpaces ', spaces);
  return spaces;
}

async function getWeatherApiKey() {
  const apiRef = doc(db, 'keys', 'openweathermap');
  const apiDoc = await getDoc(apiRef);
  if (apiDoc.exists()) {
    return apiDoc.data().api;
  }
  return null;
}

async function getWeather(city, state) {
  const trimCity = city.trim();
  const trimState = state.trim();
  const APIkey = await getWeatherApiKey();
  // eslint-disable-next-line max-len
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${trimCity},${trimState},US&appid=${APIkey}&units=imperial`);
  return response.json();
}

async function getAirPollution(lat, lon) {
  const APIkey = await getWeatherApiKey();
  // eslint-disable-next-line max-len
  const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}`);
  return response.json();
}

// Create a function that will get the user's organization space thresholds and
// weather API data and then email or text the user
function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}

function checkTemp(weather, space) {
  const { main: { temp } } = weather;
  const { minTemp, maxTemp } = space;
  return (temp > minTemp) && (temp < maxTemp);
}

function checkHumidity(weather, space) {
  const { main: { humidity } } = weather;
  const { maxHumidity } = space;
  return humidity < maxHumidity;
}

function checkAirPollution(airPollution) {
  const { list: [{ main: { aqi } }] } = airPollution;
  const { maxAqi } = this.space;
  return aqi < maxAqi;
}

async function checkIfOpenable(notification) {
  functions.logger.log('In check if openable: ', notification);
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
      const okAirPollution = checkAirPollution(airPollution);
      functions.logger.log('okTemp: ', okTemp);
      functions.logger.log('okHumidity: ', okHumidity);
      functions.logger.log('okAirPollution: ', okAirPollution);
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
  if ((sendTimeHours + timezoneOffset) > 23) {
    currentDayIndex -= 1;
  } else if ((sendTimeHours + timezoneOffset) < 23) {
    currentDayIndex += 1;
  }
  return days[currentDayIndex];
}

async function sendNotification(notification) {
  functions.logger.log('In send notification: ', notification);
  const openable = await checkIfOpenable(notification);
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
    const date = new Date();
    const timestamp = date.getTime();
    const hoursAndMinutes = `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`;
    const query = db.collection('notifications');
    const notificationDocuments = await query.get();
    notificationDocuments.forEach((document) => {
      if (document.data().notifications) {
        document.data().notifications.forEach(async (notification) => {
          const {
            enabled, startDate, endDate, repeatDays, sendTime, timezoneOffset, phoneNumber,
          } = notification;
          const UTCSendTime = sendTimeToUTC(sendTime, timezoneOffset);
          const currentDay = getCurrentDay(sendTime, timezoneOffset, date);
          const repeatsToday = repeatDays.some((day) => day === currentDay);
          if (enabled && startDate && endDate && repeatsToday && phoneNumber && UTCSendTime === hoursAndMinutes) {
            const startTime = new Date(startDate).getTime() + (timezoneOffset * 3600000);
            const endTime = new Date(endDate).getTime() + (timezoneOffset * 3600000);
            if (startTime < timestamp && endTime > timestamp) {
              await sendNotification(notification);
            }
          }
        });
      }
    });
    return null;
  });

exports.sendPasswordReset = functions.firestore
  .document('passwordResetRequests/{email}')
  .onWrite(async (change, context) => {
    db.collection('passwordResetRequests').doc(context.params.userId).delete().then(() => {
      functions.logger.log('Document successfully deleted!');
    });
  });
