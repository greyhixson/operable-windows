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
        required
      />
      <v-text-field
        v-model="password"
        class="mx-auto"
        type="password"
        placeholder="Password"
        label="Please enter your password"
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
      <h3 class="mx-auto pt-8">
        Need an account? <a
          href="#/signup"
          class="text-decoration-underline"
        > Sign up now </a>
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
      password: '',
      accountBtnText: 'Sign In',
      valid: false,
      alert: '',
      alertType: '',
      userStore,
    };
  },
  watch: {
    'userStore.user': function watchUser(userCred) {
      if (userCred) {
        this.accountBtnText = 'Sign Out';
        this.alert = 'You are now signed in';
      } else if (!userCred) {
        this.accountBtnText = 'Sign In';
      }
    },
  },
  methods: {
    accountBtn() {
      if (!userStore.user) {
        userStore.signIn(this.email, this.password);
      } else if (userStore.user) {
        userStore.signOut();
      }
    },
  },
};
</script>
