<template>
  <v-app>
    <v-main>
      <v-container
        style="padding-bottom: 300px;"
        fluid
        fill-height
      >
        <router-view />
      </v-container>
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
