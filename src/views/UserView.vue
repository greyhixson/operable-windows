<template>
  <div>
    <location-input />
    <window-info />
  </div>
</template>

<script>
import LocationInput from '../components/LocationInput';
import WindowInfo from '../components/WindowInfo';

export default {
  name: 'UserView',
  components: {
    LocationInput,
    WindowInfo,
  },
};
</script>
