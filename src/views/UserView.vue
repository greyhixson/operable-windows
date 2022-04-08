<template>
  <v-container class="text-center">
    <select-space
      @submitWeather="getWeather"
      @submitThresholds="getThresholds"
      @submitOrgName="getOrgName"
      @submitAirPollution="getAirPollution"
      @closeCard="closeCard"
    />
    <display-space
      v-if="submittedThresholds && submittedWeather && submittedAirPollution && !cardClosed"
      :weather="submittedWeather"
      :space-thresholds="submittedThresholds"
      :org-name="submittedOrgName"
      :air-pollution="submittedAirPollution"
    />

    <v-row
      class="pt-6"
    >
      <v-btn
        class="mr-4"
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
        to="/settings"
      >
        Settings
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import userStore from '@/store/UserStore';
import { signOut } from '@/store/FirebaseStore';
import SelectSpace from '../components/SelectSpace.vue';
import DisplaySpace from '../components/DisplaySpace.vue';

export default {
  name: 'UserView',
  components: {
    SelectSpace,
    DisplaySpace,
  },
  data() {
    return {
      submittedWeather: '',
      submittedThresholds: '',
      submittedAirPollution: '',
      submittedOrgName: '',
      cardClosed: false,
      accountBtnText: 'Sign In',
      userStore,
    };
  },
  watch: {
    'userStore.userCredential': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
      } else if (!userCred) {
        this.accountBtnText = 'Sign In';
      }
    },
  },
  mounted() {
    if (userStore.userCredential) {
      this.accountBtnText = 'Sign Out';
    } else if (!userStore.userCredential) {
      this.accountBtnText = 'Sign In';
    }

    this.$nextTick(() => {
      if (!this.$cookies.isKey('settings')) {
        this.$cookies.set('settings', userStore.settings);
      } else if (this.$cookies.isKey('settings')) {
        userStore.settings = this.$cookies.get('settings');
      }
    });
  },
  methods: {
    getWeather(event) {
      this.submittedWeather = event;
    },
    getThresholds(event) {
      this.submittedThresholds = event;
    },
    getOrgName(event) {
      this.submittedOrgName = event;
    },
    getAirPollution(event) {
      this.submittedAirPollution = event;
    },
    closeCard(event) {
      this.cardClosed = event;
    },
    accountBtn() {
      if (!userStore.userCredential) {
        this.$router.push('/signin');
      } else if (userStore.userCredential) {
        signOut();
      }
    },
  },
};
</script>
