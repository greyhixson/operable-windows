<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h5 pb-8">
          {{ windowThresholds.city }}, {{ windowThresholds.state }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          Too Cold!
        </v-list-item-title>
        <v-list-item-subtitle>The acceptable temperature range is 65F - 75F</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6 pb-8">
          Humidity
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

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
      okTemp: Boolean,
    };
  },
  created() {
    this.checkTemp();
  },
  methods: {
    checkTemp() {
      console.log(this.weather);
      console.log(this.windowThresholds);
    },
  },
};
</script>
