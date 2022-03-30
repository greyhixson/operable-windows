<template>
  <v-container
    style="width: 400px;"
  >
    <v-form
      v-model="valid"
      @submit.prevent="onSignup"
    >
      <v-text-field
        v-model="email"
        type="email"
        placeholder="Email"
        label="Please enter your email"
      />
      <v-text-field
        v-model="password"
        type="password"
        placeholder="Password"
        label="Please enter your password"
      />
      <v-text-field
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        label="Please confirm your password"
        :rules="comparePasswords"
      />
      <v-btn
        class="mx-auto"
        width="200"
        height="50"
        @click="createAccount"
      >
        Create an Account
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import userStore from '@/store';

export default {
  name: 'SignUp',
  data() {
    return {
      valid: true,
      email: '',
      password: '',
      confirmPassword: '',
      comparePasswords: [
        (v) => v === this.password || 'Passwords do not match',
      ],
    };
  },
  methods: {
    createAccount() {
      if (this.valid) {
        userStore.createAccount(this.email, this.password);
      }
    },

  },
};
</script>
