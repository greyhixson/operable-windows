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
    <v-row dense>
      <v-btn
        class="mx-auto"
        width="180"
        height="50"
        @click="accountBtn"
      >
        {{ accountBtnText }}
      </v-btn>
      <v-btn
        class="mx-auto"
        width="180"
        height="50"
      >
        Account Settings
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { userStore } from '@/firebase/FirebaseStore';
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
      accountBtnText: 'Sign In',
      userStore,
    };
  },
  watch: {
    'userStore.user': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
      } else if (!userCred) {
        this.accountBtnText = 'Sign In';
      }
    },
  },
  created() {
    if (userStore.user) {
      this.accountBtnText = 'Sign Out';
    } else if (!userStore.user) {
      this.accountBtnText = 'Sign In';
    }
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
        this.$router.push('/signin');
      } else if (userStore.user) {
        userStore.signOut();
      }
    },
  },
};
</script>
