<template>
  <v-container>
    <v-card
      max-width="400"
      class="mx-auto"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h4 black--text">
            {{ spaceThresholds.space }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon
            :class="okTemp ? 'green': 'red'"
            dark
          >
            {{ okTemp ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Temperature: {{ weather.main.temp.toFixed(0) }}F
          </v-list-item-title>
          <v-list-item-subtitle>
            Acceptable temperature range: {{ spaceThresholds.min_temp }}F
            - {{ spaceThresholds.max_temp }}F
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon
            :class="okHumidity ? 'green': 'red'"
            dark
          >
            {{ okHumidity ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="text-h6"
          >
            Humidity: {{ weather.main.humidity }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Acceptable max humidity: {{ spaceThresholds.max_humidity }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon
            :class="okAirPollution ? 'green': 'red'"
            dark
          >
            {{ okAirPollution ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="text-h6"
          >
            Air Quality Index: {{ airPollution.list[0].main.aqi }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Acceptable AQI: {{ spaceThresholds.max_aqi }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        two-line
        :style="openWindow ? 'background-color:#68ad53;': 'background-color:#c42741;'"
      >
        <v-list-item-content>
          <v-list-item-title
            class="text-h5 white--text"
          >
            {{ windowMessage }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-card-actions>
        <v-btn
          text
          @click="saveSelection"
        >
          Save preferences
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-alert
      v-if="alert"
      :type="alertType"
      dismissble
      class="mt-2"
    >
      {{ alertMessage }}
    </v-alert>
  </v-container>
</template>

<script>
/**
 * Weather Object from the OpenWeather Current Weather Data API
 * @typedef {Object} weather
 * @property main     - Primary weather conditions
 * @property temp     - Temperature (In celsius)
 * @property humidity - Humidity
 */
/**
 * Air Pollution object from the OpenWeather Air Pollution API
 * @typedef {Object} airPollution
 * @property list - Contains the date time, main, and components
 * @property main - Contains the AQI
 * @property aqi  - AQI
 */

/**
 * Window Thresholds object from the firestore
 * @typedef {Object} spaceThresholds
 * @property min_temp     - Min temp (C°) it needs to be for the window to be open
 * @property max_temp     - Max temp (C°) it can be for the window to be open
 * @property max_humidity - Max humidity it can be for the window to be open
 * @property max_aqi      - Max air pollution it can be for the window to be open
 * @property space        - The location the user is in
 */

import { updateSettings } from '@/API/firestoreAPI';
import { user } from '@/store/store';

export default {
  name: 'DisplaySpace',
  props: {
    spaceThresholds: {
      type: Object,
      required: true,
    },
    orgName: {
      type: String,
      required: true,
    },
    weather: {
      type: Object,
      required: true,
    },
    airPollution: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openWindow: Boolean,
      okTemp: Boolean,
      okHumidity: Boolean,
      okAirPollution: Boolean,
      windowMessage: '',
      alertType: '',
      alertMessage: '',
      alert: false,
    };
  },
  created() {
    this.checkTemp();
    this.checkHumidity();
    this.checkAirPollution();
    this.decideWindow();
  },
  methods: {
    checkTemp() {
      const { main: { temp } } = this.weather;
      const { min_temp: minTemp, max_temp: maxTemp } = this.spaceThresholds;
      this.okTemp = (temp > minTemp) && (temp < maxTemp);
    },
    checkHumidity() {
      const { main: { humidity } } = this.weather;
      const { max_humidity: humidityMax } = this.spaceThresholds;
      this.okHumidity = humidity < humidityMax;
    },
    checkAirPollution() {
      const { list: [{ main: { aqi } }] } = this.airPollution;
      const { max_aqi: aqiMax } = this.spaceThresholds;
      this.okAirPollution = aqi < aqiMax;
    },
    decideWindow() {
      if (this.okAirPollution && this.okTemp && this.okHumidity) {
        this.openWindow = true;
        this.windowMessage = 'Openable';
      } else {
        this.openWindow = false;
        this.windowMessage = 'Keep Closed';
      }
    },
    saveSelection() {
      const { settings } = user;
      settings.favorite_space = this.spaceThresholds.space;
      settings.favorite_organization = this.orgName;
      if (user.userCredential) {
        updateSettings(settings);
      }
      this.$cookies.set('settings', settings);
      this.alertMessage = 'Preferences saved';
      this.alertType = 'success';
      this.alert = true;
    },
  },
};
</script>
