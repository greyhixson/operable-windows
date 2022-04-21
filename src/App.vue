<template>
  <v-app>
    <v-main>
      <v-app-bar
        app
        dense
        color="#87212E"
      >
        <v-toolbar-title style="color: white; font-size: 25px;">
          Operable Windows Notifier
        </v-toolbar-title>
      </v-app-bar>
      <v-container
        id="appView"
        fill-height
      >
        <router-view />
      </v-container>
      <v-footer>
        <v-col
          class="text-center mx-auto"
          cols="12"
        >
          <h5>
            To view more information on how the air quality index is calculated, visit
            <a href="https://openweathermap.org/api/air-pollution"> OpenWeather Map </a>
          </h5>
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
<style scoped>
#appView {
  padding-bottom: 240px;
}
</style>
