<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ windowThresholds.city }}, {{ windowThresholds.state }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-avatar>
        <v-icon
          :class="okTemp ? 'green': 'red'"
          dark
        >
          {{ okTemp ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          Temperature
        </v-list-item-title>
        <v-list-item-subtitle>
          Acceptable temperature range: {{ windowThresholds.min_temp }}F
          - {{ windowThresholds.max_temp }}F
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-avatar>
        <v-icon
          :class="okHumidity ? 'green': 'red'"
          dark
        >
          {{ okHumidity ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          class="text-h6"
        >
          Humidity
        </v-list-item-title>
        <v-list-item-subtitle>
          Acceptable max humidity: {{ windowThresholds.humidity_max }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-avatar>
        <v-icon
          :class="okAirPollution ? 'green': 'red'"
          dark
        >
          {{ okAirPollution ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          class="text-h6"
        >
          Air Quality Index
        </v-list-item-title>
        <v-list-item-subtitle>
          Acceptable max pollution: {{ windowThresholds.aqi_max }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title
          class="text-h4 font-weight-bold"
          :style="openWindow ? 'color:#68ad53;' : 'color:#c42741;'"
        >
          {{ windowMessage }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-card-actions>
      <v-btn text>
        Sign up for notifications
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'UserWindow',
  props: {
    windowThresholds: {
      type: Object,
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
      openWindow: Boolean,
      okTemp: Boolean,
      okHumidity: Boolean,
      okAirPollution: Boolean,
      windowMessage: '',
    };
  },
  created() {
    this.checkTemp();
    this.checkHumidity();
    this.checkAirPollution();
    this.decideWindow();
  },
  methods: {
    checkTemp() {
      if ((this.weather.main.temp > this.windowThresholds.min_temp)
      && (this.weather.main.temp < this.windowThresholds.max_temp)) {
        this.okTemp = true;
      } else {
        this.okTemp = false;
      }
    },
    checkHumidity() {
      if (this.weather.main.humidity < this.windowThresholds.humidity_max) {
        this.okHumidity = true;
      } else {
        this.okHumidity = false;
      }
    },
    checkAirPollution() {
      if (this.airPollution.list[0].main.aqi < this.windowThresholds.aqi_max) {
        this.okAirPollution = true;
      } else {
        this.okAirPollution = false;
      }
    },
    decideWindow() {
      if (this.okAirPollution && this.okTemp && this.okHumidity) {
        this.openWindow = true;
        this.windowMessage = 'Ok to open';
      } else {
        this.openWindow = false;
        this.windowMessage = 'Keep closed';
      }
    },
  },
};
</script>
