<template>
  <v-container>
    <v-form style="width: 300px;">
      <v-text-field
        label="Organization Name"
      />
      <v-text-field
        label="City"
      />
      <v-text-field
        label="State"
      />
      <v-text-field
        label="Space"
      />
      <v-text-field
        label="Maximum Humidity (%)"
      />
      <v-text-field
        label="Minimum Temperature (F°)"
      />
      <v-text-field
        label="Maximum Temperature (F°)"
      />
      <v-text-field
        label="Maximum Air Pollution"
      />
      <h5> To view more information on how air pollution is calculated visit <a href="https://openweathermap.org/api/air-pollution"> OpenWeather Map </a></h5>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'ManageOrg',
};
</script>
