<template>
  <v-app>
    <v-main>
      <v-container
        fill-height
        fluid
        style="padding-bottom: 300px;"
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
