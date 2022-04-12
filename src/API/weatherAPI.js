import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/store/store';

async function getWeatherApiKey() {
  const apiRef = doc(db, 'keys', 'openweathermap');
  const apiDoc = await getDoc(apiRef);
  if (apiDoc.exists()) {
    return apiDoc.data().api;
  }
  return null;
}

const APIkey = getWeatherApiKey();

async function getWeather(city, state) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},US&appid=${APIkey}&units=imperial`)
    .then((response) => response.json())
    .then((weather) => weather);
}

async function getAirPollution(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}`)
    .then((response) => response.json())
    .then((airPollution) => airPollution);
}

export { getWeather, getAirPollution };
