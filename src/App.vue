<template>
  <v-app>
    <v-main>
      <v-container
        fill-height
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="auto"
          >
            <router-view />
            <login-button />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LoginButton from '@/components/LoginButton.vue';

export default {
  name: 'App',
  components: { LoginButton },
  data: () => ({
    //
  }),
};
</script>
