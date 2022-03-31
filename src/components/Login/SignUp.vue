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
      <v-row>
        <v-btn
          class="mx-auto"
          width="180"
          height="50"
          @click="createAccount"
        >
          Create an Account
        </v-btn>
        <v-btn
          class="mx-auto pl-4"
          width="180"
          height="50"
          to="/"
        >
          Home
        </v-btn>
      </v-row>
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
      email: '@gmail.com',
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
    'userStore.errorCode': function watchErrors(errorCode) {
      this.alertType = 'error';
      if (errorCode === 'auth/email-already-in-use') {
        this.alert = 'An account with this email already exists';
      } else {
        this.alert = errorCode;
      }
    },
    'userStore.justCreated': function watchAccountCreation(justCreated) {
      console.log('test');
      if (justCreated) {
        userStore.justCreated = false;
        this.alertType = 'success';
        this.alert = 'An account verification email has been sent.';
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
