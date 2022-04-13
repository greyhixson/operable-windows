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
        <v-row
          justify="center"
        >
          <v-col
            cols="auto"
          >
            <router-view />
          </v-col>
        </v-row>
      </v-container>
      <v-footer>
        <v-col
          class="text-center mx-auto"
          cols="12"
        >
          <h5>
            To view more information on how air pollution is calculated, visit
            <a href="https://openweathermap.org/api/air-pollution"> OpenWeather Map </a>
          </h5>
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
</template>

<style scoped>
#appView {
  padding-bottom: 240px;
}
</style>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
