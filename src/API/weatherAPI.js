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

export { getWeather, getAirPollution };
