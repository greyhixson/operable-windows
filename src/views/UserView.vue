<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-col
        xs="12"
        sm="8"
        md="6"
        lg="5"
        xl="3"
      >
        <v-row no-gutters>
          <v-col>
            <select-space
              @submitWeather="getWeather"
              @submitSpace="getSpace"
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
              v-if="submittedSpace && submittedWeather && submittedAirPollution && submittedOrgName && !cardClosed"
              class="pb-4"
              :weather="submittedWeather"
              :space="submittedSpace"
              :org-name="submittedOrgName"
              :air-pollution="submittedAirPollution"
            />
          </v-col>
        </v-row>
        <v-row
          no-gutters
        >
          <v-col class="mr-2">
            <v-btn
              block
              min-width="125"
              min-height="50"
              @click="accountBtn"
            >
              {{ accountBtnText }}
            </v-btn>
          </v-col>
          <v-col class="ml-2">
            <v-btn
              block
              min-width="125"
              min-height="50"
              @click="settings"
            >
              Settings
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
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
      submittedSpace: '',
      submittedAirPollution: '',
      submittedOrgName: '',
      cardClosed: false,
      accountBtnText: 'Sign In',
    };
  },
  computed: {
    auth() {
      return getAuth();
    },
  },
  mounted() {
    const { auth } = this;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.accountBtnText = 'Sign out';
      } else {
        this.accountBtnText = 'Sign in';
      }
    });
  },
  methods: {
    getWeather(event) {
      this.submittedWeather = event;
    },
    getSpace(event) {
      this.submittedSpace = event;
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
    async accountBtn() {
      if (this.auth.currentUser) {
        await signOut(this.auth);
      } else {
        await this.$router.push('/signin').catch(() => {});
      }
    },
    settings() {
      const { currentUser } = this.auth;
      if (currentUser) {
        this.$router.push('/settings').catch(() => {});
      } else {
        this.$router.push('/signin').catch(() => {});
      }
    },
  },
};
</script>
