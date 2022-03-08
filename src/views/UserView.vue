<template>
  <v-container>
    <user-location
      @submitWeather="getWeather"
      @submitThresholds="getThresholds"
    />
    <user-window
      v-if="submittedThresholds && submittedWeather"
      :weather="submittedWeather"
      :window-thresholds="submittedThresholds"
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
    };
  },
  methods: {
    getWeather(event) {
      this.submittedWeather = event;
    },
    getThresholds(event) {
      this.submittedThresholds = event;
    },
  },
};
</script>
