<template>
  <div>
    <user-location @submitLocation="getLocation"/>
    <user-window v-if="submittedLocation" :location="submittedLocation"/>
  </div>
</template>

<script>
import UserLocation from '../components/UserLocation';
import UserWindow from '../components/UserWindow';

export default {
  name: 'UserView',
  components: {
    UserLocation,
    UserWindow,
  },
  data() {
    return {
      submittedLocation: null
    }
  },
  methods: {
    getLocation(event) {
      this.submittedLocation = event;
    }
  }
};
</script>
