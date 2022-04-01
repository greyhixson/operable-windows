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
      @click="accountBtn"
    >
      {{ accountBtnText }}
    </v-btn>
  </v-container>
</template>

<script>
import userStore from '@/store';
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
      accountBtnText: 'Sign Out',
      userStore,
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
    accountBtn() {
      if (!userStore.user) {
        this.accountBtnText = 'Sign In';
        this.$router.push('/signin');
      } else if (userStore.user) {
        this.accountBtnText = 'Sign Out';
        userStore.signOut();
      }
    },
  },
};
</script>
