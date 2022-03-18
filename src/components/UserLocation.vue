<template>
  <v-container>
    <v-row>
      <v-col
        cols="3"
        class="mx-auto"
      >
        <v-alert
          v-if="unsupportedLocation"
          type="error"
          fixed
        >
          {{ location.city }}, {{ location.state }} is unsupported
        </v-alert>
        <v-card
          flat
        >
          <v-card-text>
            <v-autocomplete
              v-model="location"
              class="userLocation"
              :items="cities"
              cache-items
              clearable
              hide-selected
              hide-no-data
              label="Search for your location"
              solo
              :search-input.sync="search"
              :filter="searchFilter"
              height="60"
            >
              <template v-slot:selection="{ item }">
                <span>{{ item.city }}, {{ item.state }}</span>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.city" />
                  <v-list-item-subtitle v-text="item.state" />
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.userLocation {
  font-size: 20px;
  min-width: 400px;
}

.userLocation >>> label {
  font-size: 20px;
}
</style>

<style>
/* Vuetify bug fix */
.v-select__selections input {
  width: 0 !important;
  min-width: 0 !important;
}
</style>

<script>
/**
 * @typedef {Object} location The user's location
 * @property city   - The user's city represented as a string.
 * @property state  - The user's state represented as a string.
 */

import getThresholds from '../firebase/firebaseinit';
import citiesJson from '../usaCities.json';
import stateAbbrJson from '../stateAbbr.json';

export default {
  name: 'UserLocation',
  data() {
    return {
      cities: citiesJson,
      stateAbbrMap: stateAbbrJson,
      search: null,
      location: Object,
      unsupportedLocation: false,
      APIkey: 'fb3f8c4acaba36f086776e594b64a68c',
      awaitingSearch: true,
    };
  },
  watch: {
    location() {
      if (!this.location) {
        this.unsupportedLocation = false;
        return;
      }
      this.getWindowThresholds();
      if (!this.unsupportedLocation) {
        this.getCurrentWeatherAndAirPollution();
      }
    },
    search() {
      this.awaitingSearch = true;
      this.timerId = setTimeout(() => {
        this.awaitingSearch = false;
      }, 100);
    },
  },
  methods: {
    searchFilter(item, queryText) {
      if (this.awaitingSearch) {
        return '';
      }
      const strippedText = queryText.replace(',', ' ').trim().toLowerCase();
      const cityState = strippedText.split(/\s+/);
      cityState.forEach((term, index) => {
        cityState[index] = term.replace(',', '');
      });
      // 1 term ex. "Fayetteville"
      if (cityState.length === 1) {
        return item.city.toLowerCase().indexOf(cityState[0]) > -1
          || item.state.toLowerCase().indexOf(cityState[0]) > -1;
      }

      // Abbreviated state ex. "AR"
      if (Object.prototype.hasOwnProperty.call(this.stateAbbrMap, cityState[cityState.length - 1]
        .toUpperCase())) {
        const state = this.stateAbbrMap[cityState[cityState.length - 1].toUpperCase()];
        cityState[cityState.length - 1] = state.toLowerCase();
      }

      // 2 words for city and state ex. "Fayetteville Arkansas"
      if (cityState.length === 2) {
        return (
          (item.city.toLowerCase().indexOf(cityState[0]) > -1
            && item.state.toLowerCase().indexOf(cityState[1]) > -1)
            || item.city.toLowerCase().indexOf(`${cityState[0]} ${cityState[1]}`) > -1
        );
        // > 2 words for city and state ex "Los Angeles California" or "Fayetteville North Carolina"
      }
      return (
        (item.city.toLowerCase().indexOf(`${cityState[0]} ${cityState[1]}`) > -1
              && item.state.toLowerCase().indexOf(cityState[2]) > -1)
            || (item.city.toLowerCase().indexOf(cityState[0]) > -1 && item.state.toLowerCase().indexOf(`${cityState[1]} ${cityState[2]}`) > -1)
      );
    },
    getCurrentWeatherAndAirPollution() {
      const { city, state } = this.location;
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},US&appid=${this.APIkey}&units=imperial`)
        .then((response) => response.json())
        .then((weather) => {
          const { coord: { lat, lon } } = weather;
          console.log('Weather: ');
          console.log(weather);
          this.$emit('submitWeather', weather);
          fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.APIkey}`)
            .then((response) => response.json())
            .then((airPollution) => {
              console.log('Air Pollution: ');
              console.log(airPollution);
              this.$emit('submitAirPollution', airPollution);
            });
        });
    },
    async getWindowThresholds() {
      const { city, state } = this.location;
      try {
        const windowThresholds = await getThresholds(city, state);
        if (typeof windowThresholds !== 'object') {
          this.unsupportedLocation = true;
          this.$emit('closeCard', true);
          return;
        }
        this.unsupportedLocation = false;
        this.$emit('closeCard', false);
        console.log('Window Thresholds: ');
        console.log(windowThresholds);
        this.$emit('submitThresholds', windowThresholds);
      } catch (e) {
        console.log('An error has occurred, please try again later');
      }
    },
  },
};
</script>
