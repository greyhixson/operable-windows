<template>
  <v-container>
    <v-autocomplete
      v-model="orgSelect"
      class="search"
      :items="orgs"
      :search-input.sync="orgSearch"
      :filter="onOrgFilter"
      label="Search for your organizaton"
      height="60"
      clearable
      return-object
    >
      <template v-slot:selection="{ item }">
        <span>{{ item.organization }}</span>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.organization" />
          <v-list-item-subtitle v-text="item.city" />
          <v-list-item-subtitle v-text="item.state" />
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-autocomplete
      v-model="spaceSelect"
      class="search"
      :items="spaces"
      :search-input.sync="spaceSearch"
      :filter="onSpaceFilter"
      label="Search for your space"
      no-data-text="Please select an organization first"
      height="60"
      clearable
      return-object
    >
      <template v-slot:selection="{ item }">
        <span>{{ item.space }}</span>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.space" />
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </v-container>
</template>

<style scoped>
.search {
  font-size: 20px;
  min-width: 400px;
}

.search >>> label {
  font-size: 20px;
  padding-bottom: 30px;
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

import {
  getAllOrgs, getAllSpaces, getSpace, APIkey,
} from '@/store/FirebaseStore';

import userStore from '@/store/UserStore';

export default {
  name: 'SelectSpace',
  data() {
    return {
      orgSearch: null,
      orgSelect: null,
      orgs: [],
      spaceSearch: null,
      spaceSelect: null,
      spaces: [],
      awaitingSearch: true,
    };
  },
  watch: {
    async orgSelect() {
      this.spaces = [];
      this.spaceSelect = null;
      this.spaceSearch = null;
      this.getCurrentWeatherAndAirPollution();
      const { organization } = this.orgSelect;
      this.spaces = await getAllSpaces(organization);
      if (userStore.settings.favorite_space) {
        const matchedSpace = this.spaces.find((space) => space.space
            === userStore.settings.favorite_space);
        if (matchedSpace) {
          this.spaceSelect = matchedSpace;
        }
      }
    },
    orgSearch() {
      this.spaces = [];
      this.spaceSelect = null;
      this.spaceSearch = null;
    },
    spaceSelect() {
      if (this.spaceSelect) {
        this.getSpaceThresholds();
      }
    },
  },
  async created() {
    this.orgs = await getAllOrgs();
    if (userStore.userCredential) {
      if (userStore.settings.favorite_organization) {
        const matchedOrg = this.orgs.find((org) => org.organization
            === userStore.settings.favorite_organization);
        if (matchedOrg) {
          this.orgSelect = matchedOrg;
        }
      }
    }
  },
  methods: {
    getCurrentWeatherAndAirPollution() {
      const { city, state } = this.orgSelect;
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},US&appid=${APIkey}&units=imperial`)
        .then((response) => response.json())
        .then((weather) => {
          const { coord: { lat, lon } } = weather;
          this.$emit('submitWeather', weather);
          fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}`)
            .then((response) => response.json())
            .then((airPollution) => {
              this.$emit('submitAirPollution', airPollution);
            });
        });
    },
    async getSpaceThresholds() {
      const { organization } = this.orgSelect;
      const { space } = this.spaceSelect;
      try {
        const spaceThresholds = await getSpace(organization, space);
        this.$emit('closeCard', false);
        this.$emit('submitThresholds', spaceThresholds);
        this.$emit('submitOrgName', organization);
      } catch (e) {
        console.log('An error has occurred, please try again later');
      }
    },
    onOrgFilter(item, queryText) {
      const { organization, state, city } = item;
      return organization.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
          || state.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
          || city.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
    },
    onSpaceFilter(item, queryText) {
      const { space } = item;
      return space.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
    },
  },
};
</script>
