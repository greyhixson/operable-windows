<template>
  <v-alert
    v-model="showAlert"
    :type="alertType"
    dismissible
  >
    {{ alertMsg }}
  </v-alert>
</template>

<script>
export default {
  name: 'AlertBanner',
  props: {
    alertType: {
      type: String,
      required: true,
    },
    alertMsg: {
      type: String,
      required: true,
    },
  },
  computed: {
    showAlert: {
      get() {
        return Boolean(this.alertMsg);
      },
      set() {
        this.alertMsg = '';
      },
    },
  },
};
</script>
