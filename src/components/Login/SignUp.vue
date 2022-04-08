<template>
  <v-container
    style="width: 400px;"
  >
    <v-alert
      v-if="alert && alertType"
      v-model="showAlert"
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
import { createAccount, signOut } from '@/API/authAPI';
import { user, error } from '@/store/store';

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
        (v) => !!v || 'Password is required',
        (v) => (v && v.length) >= 6 || 'Password must be atleast 6 characters long',
      ],
      confirmPassword: '',
      comparePasswordsRules: [
        (v) => !!v || 'Confirm password is required',
        (v) => v === this.password || 'Passwords do not match',
      ],
      alertType: '',
      alert: '',
      showAlert: false,
      accountBtnText: 'Create an Account',
      initUser: false,
      user,
      error,
    };
  },
  watch: {
    'error.code': function watchError(code) {
      if (code) {
        error.message = '';
        this.showAlert = true;
        this.alertType = 'error';
        if (code === 'auth/email-already-in-use') {
          this.alert = 'An account with this email already exists';
        } else {
          this.alert = code;
        }
      }
    },
    'user.userCredential': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
        if (this.initUser) {
          this.showAlert = true;
          this.alertType = 'success';
          this.alert = "You've been signed in and an account verification email has been sent.";
          this.$refs.form.reset();
        }
      } else if (!userCred) {
        this.accountBtnText = 'Create an Account';
      }
    },
  },
  methods: {
    async accountBtn() {
      if (!user.userCredential) {
        this.$refs.form.validate();
        if (this.valid) {
          this.initUser = true;
          await createAccount(this.email, this.password);
        }
      } else if (user.userCredential) {
        signOut();
      }
    },
  },
};
</script>
