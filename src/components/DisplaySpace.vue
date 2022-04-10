<template>
  <v-container>
    <v-card
      max-width="400"
      class="mx-auto"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h4 black--text">
            {{ space.name }}
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
            Acceptable temperature range: {{ space.minTemp }}F
            - {{ space.maxTemp }}F
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
            Acceptable max humidity: {{ space.maxHumidity }}
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
            Acceptable AQI: {{ space.maxAqi }}
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
          Save selection
        </v-btn>
      </v-card-actions>
    </v-card>
    <alert-banner
      v-if="alert.msg && alert.type"
      :alert-msg="alert.msg"
      :alert-type="alert.type"
      :show-alert-prop="alert.show"
      @resetAlert="resetAlert"
    />
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
 * @typedef {Object} space
 * @property minTemp     - Min temp (C°) it needs to be for the window to be open
 * @property maxTemp     - Max temp (C°) it can be for the window to be open
 * @property maxHumidity - Max humidity it can be for the window to be open
 * @property maxAqi      - Max air pollution it can be for the window to be open
 * @property name         - The name of the space
 */

import { getAuth } from 'firebase/auth';
import { db } from '@/store/store';
import { doc, updateDoc } from 'firebase/firestore';
import AlertBanner from '@/components/AlertBanner.vue';

export default {
  name: 'DisplaySpace',
  components: {
    AlertBanner,
  },
  props: {
    space: {
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
      alert: {
        type: '',
        msg: '',
        show: false,
      },
    };
  },
  computed: {
    auth() {
      return getAuth();
    },
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
      const { minTemp, maxTemp } = this.space;
      this.okTemp = (temp > minTemp) && (temp < maxTemp);
    },
    checkHumidity() {
      const { main: { humidity } } = this.weather;
      const { humidityMax } = this.space;
      this.okHumidity = humidity < humidityMax;
    },
    checkAirPollution() {
      const { list: [{ main: { aqi } }] } = this.airPollution;
      const { aqiMax } = this.space;
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
    async saveSelection() {
      const updatedFavorite = { orgName: this.orgName, spaceName: this.space.name };
      if (this.auth.currentUser) {
        const { uid } = this.auth.currentUser;
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
          favorite: updatedFavorite,
        });
      }
      this.alert.show = true;
      this.alert.msg = 'Preferences saved';
      this.alert.type = 'success';
    },
    resetAlert() {
      this.alert.show = false;
      this.alert.msg = '';
      this.alert.type = '';
    },
  },
};
</script>
