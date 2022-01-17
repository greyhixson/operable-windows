<template>
  <v-container>
    <p>{{ location.city }}, {{ location.state }}</p>
    <p>{{ openWindow }}</p>
  </v-container>
</template>
    


<script>
import { getThresholds } from '../firebase/firebaseinit.js';

export default {
  name: 'UserWindow',
  // *----------------------- P r o p s ----------------------------------------------------------
  props: {
    location: Object,
  },
  // *----------------------- D a t a -----------------------------------------------------------
  data() {
    // TODO Hide APIKey
    return {
      APIkey: 'fb3f8c4acaba36f086776e594b64a68c',
      weather: Object,
      windowThresholds: Object,
      openWindow: null,
    };
  },
  computed: {},
  created() {
    this.getCurrentWeather();
  },
  methods: {
    // TODO: Error handling
    // Retrieves the current weather from openweathermap
    getCurrentWeather() {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.location.city}&appid=${this.APIkey}&units=imperial`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.weather = data;
          this.getWindowThresholds()
        });
    },
    // TODO: Error handling
    async getWindowThresholds() {
      this.windowThresholds = await getThresholds(this.location.city, this.location.state);
      if (
        this.windowThresholds.max_temp > this.weather.main.temp &&
        this.windowThresholds.min_temp < this.weather.main.temp &&
        this.windowThresholds.humidity_max > this.weather.humidity
      ) {
        this.openWindow = 'Open Window';
      }
      else {
        this.openWindow = 'Close Window';
      }
    },
  },
};
</script>

<style scoped>
</style>