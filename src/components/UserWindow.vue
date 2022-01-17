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
    return {
      APIkey: 'fb3f8c4acaba36f086776e594b64a68c',
      weather: Object,
      windowThresholds: Object,
      openWindow: null,
    };
  },
  // *----------------------- C o m p u t e d ---------------------------------------------------
  computed: {},
  // *----------------------- L i f e   c i r c l e ---------------------------------------------
  created() {
    this.getCurrentWeather();
  },
  // *----------------------- M e t h o d s -----------------------------------------------------
  methods: {
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
  // *----------------------- W a t c h ---------------------------------------------------------
  watch: {},
};
</script>

<style scoped>
</style>