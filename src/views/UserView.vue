<template>
  <v-container
    class="d-flex justify-center"
    style="padding-bottom: 300px;"
  >
    <v-col cols="auto">
      <user-location
        @submitLocation="getLocation"
      />
      <user-window
        :location="submittedLocation"
      />
    </v-col>
  </v-container>
</template>

<script>
import UserLocation from '../components/UserLocation.vue';
import UserWindow from '../components/UserWindow.vue';

export default {
  name: 'UserView',
  components: {
    UserLocation,
    UserWindow,
  },
  data() {
    return {
      submittedLocation: {},
    };
  },
  methods: {
    getLocation(event) {
      this.submittedLocation = event;
    },
  },
};
</script>
