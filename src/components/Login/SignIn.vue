<template>
  <v-container>
    <v-row justify="center">
      <v-col
        xs="12"
        sm="8"
        md="6"
        lg="5"
        xl="3"
      >
        <alert-banner
          v-if="alert.msg && alert.type"
          :alert-msg="alert.msg"
          :alert-type="alert.type"
          :show-alert-prop="alert.show"
          @resetAlert="resetAlert"
        />
        <v-form
          ref="form"
          v-model="validForm"
          @submit.prevent="accountBtn"
        >
          <v-text-field
            v-model="email"
            type="email"
            placeholder="Email"
            label="Please enter your email"
            :rules="emailRules"
            required
            style="display: block"
          />
          <v-text-field
            v-if="!passwordReset"
            v-model="password"
            type="password"
            placeholder="Password"
            label="Please enter your password"
            :rules="passwordRules"
            required
            style="display: block"
          />
          <h5 v-if="!passwordReset">
            Forgot your password? <a
              @keyup.enter="passwordReset = true; alert.msg = false;"
              @click.prevent="passwordReset = true; alert.msg = false;"
            >
              Reset it here </a>
          </h5>
        </v-form>
        <v-row
          no-gutters
          class="pt-4 mb-n4"
        >
          <v-col>
            <v-btn
              class="mr-2"
              min-height="50"
              block
              @click="accountBtn"
            >
              {{ accountBtnText }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="ml-2"
              min-height="50"
              to="/"
              block
            >
              Home
            </v-btn>
          </v-col>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import AlertBanner from '../AlertBanner.vue';

export default {
  name: 'SignIn',
  components: {
    AlertBanner,
  },
  data() {
    return {
      validForm: false,
      alert: {
        type: '',
        msg: '',
        show: false,
      },
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
      // Sign in a user if they're not signed in
      if (!this.auth.currentUser) {
        this.$refs.form.validate();
        if (this.validForm) {
          try {
            await signInWithEmailAndPassword(this.auth, this.email, this.password);
            this.setAlert('success', "You've been signed in");
            this.forgotPasswordPrompt = false;
            this.$refs.form.reset();
          } catch {
            if (!this.passwordReset) {
              this.setAlert('error', 'Incorrect password or email');
              this.forgotPasswordPrompt = true;
            } else {
              this.setAlert('success', `Password reset email sent to: ${this.email}`);
            }
          }
        }
        // Sign out a user
      } else if (this.auth.currentUser) {
        try {
          await signOut(this.auth);
          this.setAlert('success', "You've been signed out.");
          this.$refs.form.reset();
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later');
        }
      }
      // Send a password reset email
      if (this.passwordReset) {
        try {
          await sendPasswordResetEmail(this.auth, this.email);
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later');
        }
      }
    },
    resetAlert() {
      this.alert.show = false;
      this.alert.msg = '';
      this.alert.type = '';
    },
    setAlert(alertType, alertMsg) {
      this.alert.show = true;
      this.alert.msg = alertMsg;
      this.alert.type = alertType;
    },
  },
};
</script>
