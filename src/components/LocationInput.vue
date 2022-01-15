<template>
  <v-container id="input" class="d-flex justify-center">
    <v-card flat width="500">
      <v-card-text>
        <v-subheader class="pa-0"> Where do you live? </v-subheader>
        <v-autocomplete
          v-model="location"
          :items="cities"
          prepend-icon="mdi-city"
          cache-items
          clearable
          hide-no-data
          hide-selected
          label="Search for your location"
          solo
          :filter="searchFilter"
        >
          <template v-slot:selection="{ item }">
            <span>{{ item.city }}, {{ item.state }}</span>
          </template>
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title> Enter your location </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.city"></v-list-item-title>
              <v-list-item-subtitle v-text="item.state"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
#input {
  padding-top: 200px;
}
</style>

<script>
import cityObject from '../usaCities.json';

export default {
  name: 'LocationInput',
  methods: {
    searchFilter(item, queryText) {
      var cityState;
      // Check if format is "city, state" or just "city state"
      if (queryText.indexOf(', ') > -1) {
        cityState = queryText.split(', ');
      } else if (queryText.indexOf(' ') > -1) {
        cityState = queryText.split(' ');
      }
      // Just the city or state ex. "Fayetteville" or "Arkansas"
      else {
        return (
          item.city.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
          item.state.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
        );
      }

      // 2 words for city and state ex. "Fayetteville Arkansas"
      if (cityState.length == 2) {
        return (
          (item.city.toLocaleLowerCase().indexOf(cityState[0].toLocaleLowerCase()) > -1 &&
            item.state.toLocaleLowerCase().indexOf(cityState[1].toLocaleLowerCase()) > -1) ||
          item.city.toLocaleLowerCase().indexOf(cityState[0].toLocaleLowerCase() + ' ' + cityState[1].toLocaleLowerCase()) > -1
        );
        // > 2 words for city and state ex. "Los Angeles California" or "Fayetteville North Carolina"
      } else {
        return (
          (item.city.toLocaleLowerCase().indexOf(cityState[0].toLocaleLowerCase() + ' ' + cityState[1].toLocaleLowerCase()) > -1 &&
            item.state.toLocaleLowerCase().indexOf(cityState[2].toLocaleLowerCase()) > -1) ||
          (item.city.toLocaleLowerCase().indexOf(cityState[0].toLocaleLowerCase()) > -1 &&
            item.state.toLocaleLowerCase().indexOf(cityState[1].toLocaleLowerCase() + ' ' + cityState[2].toLocaleLowerCase()) > -1)
        );
      }
    },
  },

  data() {
    return {
      cities: cityObject,
      search: null,
      location: null,
    };
  },
};
</script>
