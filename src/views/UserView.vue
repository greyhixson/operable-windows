<template>
  <v-container class="text-center">
    <v-row no-gutters>
      <v-col>
        <select-space
          @submitWeather="getWeather"
          @submitThresholds="getThresholds"
          @submitOrgName="getOrgName"
          @submitAirPollution="getAirPollution"
          @closeCard="closeCard"
        />
      </v-col>
    </v-row>
    <v-row
      no-gutters
    >
      <v-col>
        <display-space
          v-if="submittedThresholds && submittedWeather && submittedAirPollution && !cardClosed"
          class="pb-4"
          :weather="submittedWeather"
          :space-thresholds="submittedThresholds"
          :org-name="submittedOrgName"
          :air-pollution="submittedAirPollution"
        />
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="mx-auto"
    >
      <v-col>
        <v-btn
          class="mr-8"
          width="165"
          height="50"
          @click="accountBtn"
        >
          {{ accountBtnText }}
        </v-btn>
        <v-btn
          class="mx-auto"
          width="165"
          height="50"
          to="/settings"
        >
          Settings
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { signOut } from '@/API/authAPI';
import { user } from '@/store/store';
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
      user,
    };
  },
  watch: {
    'user.userCredential': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
      } else if (!userCred) {
        this.accountBtnText = 'Sign In';
      }
    },
  },
  mounted() {
    if (user.userCredential) {
      this.accountBtnText = 'Sign Out';
    } else if (!user.userCredential) {
      this.accountBtnText = 'Sign In';
    }

    this.$nextTick(() => {
      if (!this.$cookies.isKey('settings')) {
        this.$cookies.set('settings', user.settings);
      } else if (this.$cookies.isKey('settings')) {
        user.settings = this.$cookies.get('settings');
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
      if (!user.userCredential) {
        this.$router.push('/signin');
      } else if (user.userCredential) {
        signOut();
      }
    },
  },
};
</script>
