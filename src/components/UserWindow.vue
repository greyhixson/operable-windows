<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ windowThresholds.city }}, {{ windowThresholds.state }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

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

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title
          class="text-h4 font-weight-bold"
          :style="openWindow ? 'color:#68ad53;' : 'color:#c42741;'"
        >
          {{ windowMessage }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-card-actions>
      <v-btn text>
        Sign up for notifications
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/**
 * Weather Object from the OpenWeather Current Weather Data API
 * @param {Object} weather
 * @param weather.main                  Primary weather conditions
 * @param weather.main.temp             Temperature (In celsius)
 * @param weather.main.humidity         Humidity
 */
/**
 * Air Pollution object from the OpenWeather Air Pollution API
 * @param airPollution
 * @param airPollution.list             Contains the date time, main, and components
 * @param airPollution.list.main        Contains the AQI
 * @param airPollution.list.main.aqi    AQI
 */
/**
 * Window Thresholds object from my firebase firestore
 * @param windowThresholds
 * @param windowThresholds.min_temp     Min temp (C°) it needs to be for the window to be open
 * @param windowThresholds.max_temp     Max temp (C°) it can be for the window to be open
 * @param windowThresholds.humidity_max Max humidity it can be for the window to be open
 * @param windowThresholds.aqi_max      Max air pollution it can be for the window to be open
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
      this.okTemp = (this.weather.main.temp > this.windowThresholds.min_temp)
          && (this.weather.main.temp < this.windowThresholds.max_temp);
    },
    checkHumidity() {
      this.okHumidity = this.weather.main.humidity < this.windowThresholds.humidity_max;
    },
    checkAirPollution() {
      this.okAirPollution = this.airPollution.list[0].main.aqi < this.windowThresholds.aqi_max;
    },
    decideWindow() {
      if (this.okAirPollution && this.okTemp && this.okHumidity) {
        this.openWindow = true;
        this.windowMessage = 'Ok to open';
      } else {
        this.openWindow = false;
        this.windowMessage = 'Keep closed';
      }
    },
  },
};
</script>
