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
        :rules="emailRules"
      />
      <v-text-field
        v-model="password"
        type="password"
        placeholder="Password"
        label="Please enter your password"
        :rules="passwordRules"
      />
      <v-text-field
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        label="Please confirm your password"
        :rules="comparePasswordsRules"
      />
      <v-row class="pt-6">
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
      emailRules: [
        (v) => !!v || 'Email is required',
      ],
      password: '',
      passwordRules: [
        (v) => v.length >= 6 || 'Password must be atleast 6 characters long',
        (v) => !!v || 'Password is required',
      ],
      confirmPassword: '',
      comparePasswordsRules: [
        (v) => v === this.password || 'Passwords do not match',
        (v) => !!v || 'Confirm password is required',
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
        this.$refs.form.reset();
      }
    },
    'userStore.userCredential': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
      } else if (!userCred) {
        this.accountBtnText = 'Create an Account';
      }
    },
  },
  methods: {
    accountBtn() {
      userStore.errorCode = null;
      if (!userStore.userCredential) {
        this.$refs.form.validate();
        if (this.valid) {
          userStore.createAccount(this.email, this.password);
        }
      } else if (userStore.userCredential) {
        userStore.signOut();
      }
    },
  },
};
</script>
