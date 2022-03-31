<template>
  <v-container
    style="width: 400px;"
  >
    <v-alert
      v-if="alert"
      :type="alertType"
      dismissible
    >
      {{ alert }}
    </v-alert>
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
        :rules="passwordRule"
      />
      <v-text-field
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        label="Please confirm your password"
        :rules="comparePasswordsRule"
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
      email: 'greyhixson@gmail.com',
      password: 'asdasdasd',
      confirmPassword: 'asdasdasd',
      comparePasswordsRule: [
        (v) => v === this.password || 'Passwords do not match',
      ],
      passwordRule: [
        (v) => v.length > 6 || 'Password must be atleast 6 characters long',
      ],
      alertType: '',
      alert: '',
      userStore,
    };
  },
  watch: {
    'userStore.errorCode': function watchErrors(newValue) {
      this.alertType = 'error';
      if (newValue === 'auth/email-already-in-use') {
        this.alert = 'An account with this email already exists';
      } else {
        this.alert = newValue;
      }
    },
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
