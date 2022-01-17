<template>
  <v-container class="d-inline-flex">
    <v-icon x-large disabled class="pt-4"> mdi-city </v-icon>
    <v-card flat>
      <v-card-text>
        <v-subheader class="text-h5"> Where do you live? </v-subheader>
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
          autofocus
          height="60"
        >
        <!-- Fix width bug !-->
          <template v-slot:selection="{ item }">
            <span>{{ item.city }}, {{ item.state }}</span>
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
.v-autocomplete {
  font-size: 20px;
}
.v-autocomplete >>> .v-label {
  font-size: 20px;
}

.v-select.fit {
  width: min-content;
}
.v-select.fit  .v-select__selection--comma {
    text-overflow: unset;
}
</style>

<script>
import citiesJson from '../usaCities.json';
import stateAbbrJson from '../stateAbbr.json';

export default {
  name: 'UserLocation',
  methods: {
    searchFilter(item, queryText) {
      var cityState;
      queryText = queryText.replace(',', ' ').trim().toLowerCase();

      // Text has multiple terms ex. "Los Angeles California" or "Fayetteville, AR"
      if (queryText.indexOf(' ')) {
        cityState = queryText.split(/\s+/);
        cityState.forEach((term, index) => {
          cityState[index] = term.replace(',', '');
        });
      }
      // 1 term ex. "Fayetteville"
      if (cityState == null || cityState.length == 1) {
        return item.city.toLowerCase().indexOf(queryText) > -1 || item.state.toLowerCase().indexOf(queryText) > -1;
      }

      // Abbreviated state ex. "AR"
      if (Object.prototype.hasOwnProperty.call(this.stateAbbrMap, cityState[cityState.length - 1].toUpperCase())) {
        let state = this.stateAbbrMap[cityState[cityState.length - 1].toUpperCase()];
        cityState[cityState.length - 1] = state.toLowerCase();
      }

      // 2 words for city and state ex. "Fayetteville Arkansas"
      if (cityState.length == 2) {
        return (
          (item.city.toLowerCase().indexOf(cityState[0]) > -1 && item.state.toLowerCase().indexOf(cityState[1]) > -1) ||
          item.city.toLowerCase().indexOf(cityState[0] + ' ' + cityState[1]) > -1
        );
        // > 2 words for city and state ex. "Los Angeles California" or "Fayetteville North Carolina"
      } else {
        return (
          (item.city.toLowerCase().indexOf(cityState[0] + ' ' + cityState[1]) > -1 &&
            item.state.toLowerCase().indexOf(cityState[2]) > -1) ||
          (item.city.toLowerCase().indexOf(cityState[0]) > -1 && item.state.toLowerCase().indexOf(cityState[1] + ' ' + cityState[2]) > -1)
        );
      }
    },
  },
  data() {
    return {
      cities: citiesJson,
      stateAbbrMap: stateAbbrJson,
      search: null,
      userLocation: null,
    };
  },
  // When location is selected, an event is emmitted so the parent component UserView will receive the object
  watch: {
    userLocation() {
      this.$emit('submitLocation', this.userLocation);
    },
  },
};
</script>
