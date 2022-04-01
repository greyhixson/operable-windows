<template>
  <v-container
    style="width: 400px;"
  >
    <v-alert
      v-if="alert && alertType"
      :type="alertType"
      dismissible
    >
      {{ alert }}
    </v-alert>
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="accountBtn"
    >
      <v-text-field
        v-model="email"
        type="email"
        placeholder="Email"
        label="Please enter your email"
        required
      />
      <v-text-field
        v-model="password"
        type="password"
        placeholder="Password"
        label="Please enter your password"
        :rules="passwordRule"
        required
      />
      <v-text-field
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        label="Please confirm your password"
        :rules="comparePasswordsRule"
        required
      />
      <v-row class="pt-4">
        <v-btn
          class="mx-auto"
          width="180"
          height="50"
          @click="accountBtn"
        >
          {{ accountBtnText }}
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
import { userStore } from '@/firebase/FirebaseStore';

export default {
  name: 'SignUp',
  data() {
    return {
      valid: true,
      email: '',
      password: '',
      confirmPassword: '',
      comparePasswordsRule: [
        (v) => v === this.password || 'Passwords do not match',
      ],
      passwordRule: [
        (v) => v.length >= 6 || 'Password must be atleast 6 characters long',
      ],
      alertType: '',
      alert: '',
      accountBtnText: 'Create an Account',
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
      if (justCreated) {
        userStore.justCreated = false;
        this.alertType = 'success';
        this.alert = 'An account verification email has been sent.';
      }
    },
    'userStore.user': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
      } else if (!userCred) {
        this.accountBtnText = 'Create an Account';
      }
    },
  },
  methods: {
    accountBtn() {
      if (this.valid && !userStore.user) {
        userStore.createAccount(this.email, this.password);
        this.$refs.form.resetValidation();
      } else if (userStore.user) {
        userStore.signOut();
      }
    },
  },
};
</script>
