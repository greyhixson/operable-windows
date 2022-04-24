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
    showAlertProp: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showAlert: this.showAlertProp,
    };
  },
  watch: {
    showAlert() {
      if (!this.showAlert) {
        this.$emit('resetAlert');
      }
    },
  },
};
</script>
