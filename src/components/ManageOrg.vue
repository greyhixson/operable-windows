<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="thresholds"
        :items-per-page="5"
        class="elevation-1"
        :loading="loading"
        loading-text="Loading... Please wait"
      />
    </v-card>
    <h5> To view more information on how air pollution is calculated, visit <a href="https://openweathermap.org/api/air-pollution"> OpenWeather Map </a></h5>
  </v-container>
</template>

<script>
import { getOrg, getAllSpaces } from '@/firebase/FirebaseStore';

export default {
  name: 'ManageOrg',
  data() {
    return {
      headers: [
        { text: 'Space', value: 'space' },
        { text: 'Maximum Humidity (%)', value: 'max_humidity' },
        { text: 'Minimum Temperature (F°)', value: 'min_temp' },
        { text: 'Maximum Temperature (F°)', value: 'max_humidity' },
        { text: 'Maximum Air Pollution', value: 'max_aqi' },
      ],
      thresholds: [],
      location: Object,
      orgName: 'University of Arkansas',
      org: Object,
      search: '',
      loading: false,
    };
  },
  created() {
    this.getOrg();
  },
  methods: {
    async getOrg() {
      this.loading = true;
      try {
        this.org = await getOrg(this.orgName);
        this.thresholds = await getAllSpaces(this.orgName);
      } catch {
        console.log('An error has occurred');
      }
      this.loading = false;
    },
  },
};
</script>
