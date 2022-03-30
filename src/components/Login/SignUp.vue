<template>
  <v-container
    style="width: 400px;"
  >
    <form>
      <v-text-field
        type="email"
        placeholder="Email"
        label="Please enter your email"
      />
      <v-text-field
        type="password"
        placeholder="Password"
        label="Please enter your password"
      />
      <v-text-field
        type="password"
        placeholder="Confirm Password"
        label="Please confirm your password"
      />
      <v-btn
        class="mx-auto"
        width="200"
        height="50"
        to="/"
      >
        Create an Account
      </v-btn>
    </form>
  </v-container>
</template>

<script>
import accountButtonStore from '@/store';

export default {
  name: 'SignUp',
  created() {
    accountButtonStore.text = 'Create an Account';
  },
};
</script>
