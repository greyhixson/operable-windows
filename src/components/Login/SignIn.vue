<template>
  <v-container
    style="width: 400px;"
  >
    <v-alert
      v-model="showAlert"
      :type="alertType"
      dismissible
    >
      {{ alertMsg }}
    </v-alert>
    <v-form
      ref="form"
      v-model="validForm"
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
import {
  getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged,
} from 'firebase/auth';

export default {
  name: 'SignIn',
  data() {
    return {
      validForm: false,
      alertType: 'success',
      alertMsg: '',
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
    };
  },
  computed: {
    showAlert: {
      get() {
        return Boolean(this.alertMsg);
      },
      set() {
        this.alertMsg = '';
      },
    },
    auth() {
      return getAuth();
    },
  },
  watch: {
    passwordReset() {
      this.accountBtnText = 'Submit';
    },
  },
  mounted() {
    const { auth } = this;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.accountBtnText = 'Sign out';
      } else {
        this.accountBtnText = 'Sign in';
      }
    });
  },
  methods: {
    async accountBtn() {
      if (!this.auth.currentUser) {
        this.$refs.form.validate();
        if (this.validForm) {
          try {
            await signInWithEmailAndPassword(this.auth, this.email, this.password);
            this.setAlert('success', 'You are now signed in');
            this.forgotPasswordPrompt = false;
            this.$refs.form.reset();
          } catch (error) {
            this.setAlert('error', 'Incorrect password or email');
            this.forgotPasswordPrompt = true;
          }
        }
      } else if (this.auth.currentUser) {
        try {
          await signOut(this.auth);
          this.setAlert('success', "You've been signed out.");
          this.$refs.form.reset();
        } catch (error) {
          this.setAlert('error', error.code);
        }
      }
      if (this.passwordReset) {
        console.log('Yet to be implemented');
      }
    },
    setAlert(alertType, alertMsg) {
      this.alertType = alertType;
      this.alertMsg = alertMsg;
    },
  },
};
</script>
