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
        class="mx-auto"
        type="email"
        placeholder="Email"
        label="Please enter your email"
        :rules="emailRules"
        required
      />
      <v-text-field
        v-if="!passwordReset"
        v-model="password"
        class="mx-auto"
        type="password"
        placeholder="Password"
        label="Please enter your password"
        :rules="passwordRules"
        required
      />
      <h5 v-if="!passwordReset && forgotPasswordPrompt">
        Forgot your password? <a @click="passwordReset = true;"> Reset it here </a>
      </h5>
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
      <h3
        v-if="!passwordReset"
        class="mx-auto pt-8"
      >
        Need an account?
        <router-link
          :to="{ path: '/signup' }"
          class="text-decoration-underline"
        >
          Sign up now
        </router-link>
      </h3>
    </v-form>
  </v-container>
</template>

<script>
import { userStore } from '@/firebase/FirebaseStore';

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      emailRules: [
        (v) => !!v || 'Email is required',
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
      ],
      passwordReset: false,
      forgotPasswordPrompt: false,
      accountBtnText: 'Sign In',
      valid: false,
      alert: '',
      alertType: '',
      userStore,
    };
  },
  watch: {
    'userStore.userCredential': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
        this.alert = 'You are now signed in';
        this.alertType = 'success';
      } else if (!userCred) {
        this.accountBtnText = 'Sign In';
        this.alert = '';
        this.alertType = '';
      }
    },
    'userStore.errorCode': function watchError() {
      this.alertType = 'error';
      this.alert = 'Incorrect password or email';
      this.forgotPasswordPrompt = true;
    },
    passwordReset() {
      this.accountBtnText = 'Submit';
    },
  },
  methods: {
    accountBtn() {
      if (!userStore.userCredential) {
        this.$refs.form.validate();
        if (this.valid) {
          userStore.signIn(this.email, this.password);
          if (!userStore.errorMessage) {
            this.$refs.form.reset();
          }
        }
      } else if (userStore.userCredential) {
        userStore.signOut();
      }
      if (this.passwordReset) {
        console.log('Yet to be implemented');
      }
    },
  },
};
</script>
