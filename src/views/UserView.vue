<template>
  <v-container class="text-center">
    <user-window
      v-if="submittedThresholds && submittedWeather && submittedAirPollution && !cardClosed"
      :weather="submittedWeather"
      :window-thresholds="submittedThresholds"
      :air-pollution="submittedAirPollution"
    />
    <user-location
      @submitWeather="getWeather"
      @submitThresholds="getThresholds"
      @submitAirPollution="getAirPollution"
      @closeCard="closeCard"
    />
    <v-btn
      class="mx-auto"
      width="200"
      height="50"
      to="/signin"
    >
      Sign In
    </v-btn>
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
      cardClosed: false,
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
    closeCard(event) {
      this.cardClosed = event;
    },
  },
};
</script>
