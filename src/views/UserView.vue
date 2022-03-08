<template>
  <v-container>
    <user-location
      @submitWeather="getWeather"
      @submitThresholds="getThresholds"
      @submitAirPollution="getAirPollution"
    />
    <user-window
      v-if="submittedThresholds && submittedWeather && submittedAirPollution"
      :weather="submittedWeather"
      :window-thresholds="submittedThresholds"
      :air-pollution="submittedAirPollution"
    />
  </v-container>
</template>

<script>
import UserLocation from '../components/UserLocation.vue';
import UserWindow from '../components/UserWindow.vue';

export default {
  name: 'UserView',
  components: {
    UserLocation,
    UserWindow,
  },
  data() {
    return {
      submittedWeather: '',
      submittedThresholds: '',
      submittedAirPollution: '',
    };
  },
  methods: {
    getWeather(event) {
      this.submittedWeather = event;
    },
    getThresholds(event) {
      this.submittedThresholds = event;
    },
    getAirPollution(event) {
      this.submittedAirPollution = event;
    },
  },
};
</script>
