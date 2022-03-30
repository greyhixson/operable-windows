<template>
  <v-app>
    <v-main>
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
