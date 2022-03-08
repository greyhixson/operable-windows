<template>
  <v-app>
    <v-main>
      <v-container
        class="d-flex justify-center"
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
