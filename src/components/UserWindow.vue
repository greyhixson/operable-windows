<template>
  <v-card
    max-width="400"
    class="mx-auto"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h4 black--text">
          {{ windowThresholds.city }}, {{ windowThresholds.state }}
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
          Temperature: {{ weather.main.temp }}F
        </v-list-item-title>
        <v-list-item-subtitle>
          Acceptable temperature range: {{ windowThresholds.min_temp }}F
          - {{ windowThresholds.max_temp }}F
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
          Acceptable max humidity: {{ windowThresholds.humidity_max }}
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
          Acceptable pollution index: {{ windowThresholds.aqi_max }}
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
      <v-btn text>
        Enable notifications
      </v-btn>
    </v-card-actions>
  </v-card>
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
 * Window Thresholds object from my firebase firestore
 * @typedef {Object} windowThresholds
 * @property min_temp     - Min temp (C°) it needs to be for the window to be open
 * @property max_temp     - Max temp (C°) it can be for the window to be open
 * @property humidity_max - Max humidity it can be for the window to be open
 * @property aqi_max      - Max air pollution it can be for the window to be open
 */

export default {
  name: 'UserWindow',
  props: {
    windowThresholds: {
      type: Object,
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
      const { min_temp: minTemp, max_temp: maxTemp } = this.windowThresholds;
      this.okTemp = (temp > minTemp) && (temp < maxTemp);
    },
    checkHumidity() {
      const { main: { humidity } } = this.weather;
      const { humidity_max: humidityMax } = this.windowThresholds;
      this.okHumidity = humidity < humidityMax;
    },
    checkAirPollution() {
      const { list: [{ main: { aqi } }] } = this.airPollution;
      const { aqi_max: aqiMax } = this.windowThresholds;
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
  },
};
</script>
