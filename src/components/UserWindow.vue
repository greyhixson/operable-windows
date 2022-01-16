<template>
  <v-container>
    <p>{{ location.city }}, {{ location.state }}</p>
    <p>{{ weather }} </p>
  </v-container>
</template>
    


<script>
export default {
  name: 'UserWindow',
  // *----------------------- P r o p s ----------------------------------------------------------
  props: {
    location: Object,
  },
  // *----------------------- D a t a -----------------------------------------------------------
  data() {
    return {
      APIkey: 'fb3f8c4acaba36f086776e594b64a68c',
      weather: null,
    };
  },
  // *----------------------- C o m p u t e d ---------------------------------------------------
  computed: {},
  // *----------------------- L i f e   c i r c l e ---------------------------------------------
  created() {
    this.getCurrentWeather();
  },
  // *----------------------- M e t h o d s -----------------------------------------------------
  methods: {
    getCurrentWeather() {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.location.city}&appid=${this.APIkey}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.weather = JSON.stringify(data);
        });
    },
  },
  // *----------------------- W a t c h ---------------------------------------------------------
  watch: {},
};
</script>

<style scoped>
</style>