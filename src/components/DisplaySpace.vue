<template>
  <v-container>
    <v-card
      class="mx-auto"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5 black--text">
            {{ space.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon
            :class="tempOk ? 'green': 'red'"
            dark
          >
            {{ tempOk ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="wrap-text text-subtitle-1 font-weight-medium">
            Temperature: {{ weather.main.temp.toFixed(0) }}F
          </v-list-item-title>
          <v-list-item-subtitle class="wrap-text">
            Temperature range: {{ space.minTemp }}F
            - {{ space.maxTemp }}F
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon
            :class="humidityOk ? 'green': 'red'"
            dark
          >
            {{ humidityOk ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="wrap-text text-subtitle-1 font-weight-medium"
          >
            Humidity: {{ weather.main.humidity }}
          </v-list-item-title>
          <v-list-item-subtitle class="wrap-text">
            Max humidity: {{ space.maxHumidity }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item two-line>
        <v-list-item-avatar>
          <v-icon
            :class="airPollutionOk ? 'green': 'red'"
            dark
          >
            {{ airPollutionOk ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="wrap-text text-subtitle-1 font-weight-medium"
          >
            Air Quality Index: {{ airPollution.list[0].main.aqi }}
          </v-list-item-title>
          <v-list-item-subtitle class="wrap-text">
            Max AQI: {{ space.maxAqi }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions
        v-if="auth.currentUser"
      >
        <v-btn
          text
          @click="saveSelection"
        >
          Save selection
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-alert
      v-if="windowAlert.msg && windowAlert.color"
      class="text-center pt-4"
      style="margin: 0;"
      :color="windowAlert.color"
      border="bottom"
      dark
    >
      <div class="pb-1">
        {{ windowAlert.msg }}
      </div>
    </v-alert>
  </v-container>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { db } from '@/store/store';
import { doc, updateDoc } from 'firebase/firestore';

export default {
  name: 'DisplaySpace',
  props: {
    space: {
      type: Object,
      required: true,
    },
    orgName: {
      type: String,
      required: true,
    },
    weather: {
      type: Object,
      required: true,
    },
    airPollution: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      windowAlert: {
        color: '',
        msg: '',
      },
    };
  },
  computed: {
    auth() {
      return getAuth();
    },
    tempOk() {
      const { main: { temp } } = this.weather;
      const { minTemp, maxTemp } = this.space;
      return (temp >= minTemp) && (temp <= maxTemp);
    },
    humidityOk() {
      const { main: { humidity } } = this.weather;
      const { maxHumidity } = this.space;
      return humidity <= maxHumidity;
    },
    airPollutionOk() {
      const { list: [{ main: { aqi } }] } = this.airPollution;
      const { maxAqi } = this.space;
      return aqi <= maxAqi;
    },
    openable() {
      return this.tempOk && this.humidityOk && this.airPollutionOk;
    },
  },
  watch: {
    openable() {
      if (this.openable) {
        this.setWindowAlert('green lighten', 'You may open your window');
      } else if (!this.openable) {
        this.setWindowAlert('red lighten-1', 'Please keep your window closed');
      }
    },
  },
  mounted() {
    if (this.openable) {
      this.setWindowAlert('green lighten', 'You may open your window');
    } else if (!this.openable) {
      this.setWindowAlert('red lighten-1', 'Please keep your window closed');
    }
  },
  methods: {
    async saveSelection() {
      const updatedFavorite = { orgName: this.orgName, spaceName: this.space.name };
      if (this.auth.currentUser) {
        const { uid } = this.auth.currentUser;
        // Update user settings with their saved org and space
        try {
          await updateDoc(doc(db, 'users', uid), {
            favorite: updatedFavorite,
          });
          this.setWindowAlert('green lighten', 'Preferences saved');
        } catch {
          this.setWindowAlert('red lighten-1', 'An error has occurred, please try again later');
        }
      }
    },
    setWindowAlert(alertColor, alertMsg) {
      this.windowAlert.color = alertColor;
      this.windowAlert.msg = alertMsg;
    },
  },
};
</script>

<style scoped>
  .wrap-text {
    white-space: normal;
  }
</style>
