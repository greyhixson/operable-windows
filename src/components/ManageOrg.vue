<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="thresholds"
      :items-per-page="5"
      class="elevation-1"
    />
    <h5> To view more information on how air pollution is calculated visit <a href="https://openweathermap.org/api/air-pollution"> OpenWeather Map </a></h5>
  </v-container>
</template>

<script>
import { getOrgCol, getAllOrgSpaces } from '@/firebase/FirebaseStore';

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
    };
  },
  created() {
    this.getOrg();
  },
  methods: {
    async getOrg() {
      try {
        this.org = await getOrgCol(this.orgName);
        this.thresholds = await getAllOrgSpaces(this.orgName);
      } catch {
        console.log('An error has occurred');
      }
    },
  },
};
</script>
