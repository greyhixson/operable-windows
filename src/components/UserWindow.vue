<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5 pb-8">
          {{ windowThresholds.city }}, {{ windowThresholds.state }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-subheader>Temperature Range</v-subheader>

    <v-card-actions>
      <v-btn text>
        Sign up for notifications
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'UserWindow',
  props: {
    windowThresholds: {
      type: Object,
      required: true,
    },
    weather: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openWindow: Boolean,
    };
  },
  computed: {},
  methods: {
  },
};
</script>
