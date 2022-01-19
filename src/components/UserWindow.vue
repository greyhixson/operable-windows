<template>
  <v-container class="d-flex justify-center">
    <v-card flat>
      <v-card-text>
        <div class="text-h5">
          {{ openWindow }}
        </div>
      </v-card-text>
    </v-card>
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
  // *----------------------- D a t a ---------------------d--------------------------------------
  data() {
    // TODO Hide APIKey
    return {
      APIkey: 'fb3f8c4acaba36f086776e594b64a68c',
      openWindow: 'Awaiting Location',
    };
  },
  computed: {},
  methods: {
    // TODO: Error handling
    // Retrieves the current weather from openweathermap
    getCurrentWeather() {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.location.city}&appid=${this.APIkey}&units=imperial`)
        .then((response) => {
          return response.json();
        })
        .then((weather) => {
          this.getWindowThresholds(weather);
        });
    },
    async getWindowThresholds(weather) {
      try {
        let windowThresholds = await getThresholds(this.location.city, this.location.state);
        if (typeof windowThresholds === 'string' || windowThresholds instanceof String) {
          this.openWindow = windowThresholds;
        } else {
          if (
            windowThresholds.max_temp > weather.main.temp &&
            windowThresholds.min_temp < weather.main.temp &&
            windowThresholds.humidity_max > weather.humidity
          ) {
            this.openWindow = 'Open Window';
          } else {
            this.openWindow = 'Close Window';
          }
        }
      } catch (e) {
        this.openWindow = 'An error has occured, please try again later';
      }
    },
  },
  watch: {
    location() {
      if(this.location != null){
        this.getCurrentWeather();
      }
      else{
        this.openWindow = 'Awaiting Location'
      }
    },
  },
};
</script>