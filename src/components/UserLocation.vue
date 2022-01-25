<template>
  <v-container class="d-flex mb-n12">
    <v-icon
      x-large
      disabled
      class="pt-4"
    >
      mdi-city
    </v-icon>
    <v-card flat>
      <v-card-text>
        <v-subheader class="text-h5">
          Where is the location of your window?
        </v-subheader>
        <v-autocomplete
          v-model="userLocation"
          :items="cities"
          cache-items
          clearable
          hide-no-data
          hide-selected
          label="Search for your location"
          solo
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
  min-width: 300px;
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
import citiesJson from '../usaCities.json';
import stateAbbrJson from '../stateAbbr.json';

export default {
  name: 'UserLocation',
  data() {
    return {
      cities: citiesJson,
      stateAbbrMap: stateAbbrJson,
      search: null,
      userLocation: Object,
    };
  },
  // Emit event to the parent component UserView on location select
  watch: {
    userLocation() {
      this.$emit('submitLocation', this.userLocation);
    },
  },
  methods: {
    searchFilter(item, queryText) {
      let cityState;
      const strippedText = queryText.replace(',', ' ').trim().toLowerCase();

      // Text has multiple terms ex. "Los Angeles California" or "Fayetteville, AR"
      if (strippedText.indexOf(' ')) {
        cityState = strippedText.split(/\s+/);
        cityState.forEach((term, index) => {
          cityState[index] = term.replace(',', '');
        });
      }
      // 1 term ex. "Fayetteville"
      if (cityState == null || cityState.length === 1) {
        return item.city.toLowerCase().indexOf(queryText) > -1
        || item.state.toLowerCase().indexOf(queryText) > -1;
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
      // > 2 words for city and state ex. "Los Angeles California" or "Fayetteville North Carolina"
      }
      return (
        (item.city.toLowerCase().indexOf(`${cityState[0]} ${cityState[1]}`) > -1
            && item.state.toLowerCase().indexOf(cityState[2]) > -1)
          || (item.city.toLowerCase().indexOf(cityState[0]) > -1 && item.state.toLowerCase().indexOf(`${cityState[1]} ${cityState[2]}`) > -1)
      );
    },
  },
};
</script>
