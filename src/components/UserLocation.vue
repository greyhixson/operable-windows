<template>
  <v-container
    class="d-flex justify-center"
  >
    <v-card flat>
      <v-card-text>
        <v-autocomplete
          v-model="location"
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
  </v-container>
</template>

<style scoped>
.v-autocomplete {
  font-size: 20px;
  min-width: 400px;
}

.v-autocomplete >>> .v-label {
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
      windowThresholds: Object,
      weather: Object,
      airPollution: Object,
      latitude: '',
      longitude: '',
      APIkey: 'fb3f8c4acaba36f086776e594b64a68c',
      awaitingSearch: true,
    };
  },
  watch: {
    location() {
      this.getWindowThresholds();
      this.getCurrentWeatherAndAirPollution();
    },
    search() {
      this.awaitingSearch = true;
      this.timerId = setTimeout(() => {
        this.awaitingSearch = false;
      }, 100);
    },
    windowThresholds() {
      this.$emit('submitThresholds', this.windowThresholds);
    },
    weather() {
      this.$emit('submitWeather', this.weather);
    },
    airPollution() {
      this.$emit('submitAirPollution', this.airPollution);
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
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.location.city},${this.location.state},US&appid=${this.APIkey}&units=imperial`)
        .then((response) => response.json())
        .then((weather) => {
          this.weather = weather;
          this.longitude = weather.coord.lon;
          this.latitude = weather.coord.lat;
          console.log('Weather: ');
          console.log(this.weather);
          fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${this.latitude}&lon=${this.longitude}&appid=${this.APIkey}`)
            .then((response) => response.json())
            .then((airPollution) => {
              this.airPollution = airPollution;
              console.log('Air Pollution: ');
              console.log(this.airPollution);
            });
        });
    },
    async getWindowThresholds() {
      try {
        this.windowThresholds = await getThresholds(this.location.city, this.location.state);
        console.log('Window Thresholds: ');
        console.log(this.windowThresholds);
      } catch (e) {
        console.log('An error has occured, please try again later');
      }
    },
  },
};
</script>
