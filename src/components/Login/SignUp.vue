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
      v-model="formValid"
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
import {
  createUserWithEmailAndPassword, getAuth, signOut, onAuthStateChanged,
} from 'firebase/auth';

export default {
  name: 'SignUp',
  data() {
    return {
      formValid: false,
      alertType: 'success',
      alertMsg: '',
      accountBtnText: 'Create an Account',
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
  mounted() {
    const { auth } = this;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.accountBtnText = 'Sign out';
      } else {
        this.accountBtnText = 'Create an Account';
      }
    });
  },
  methods: {
    async accountBtn() {
      if (this.auth.currentUser) {
        try {
          await signOut(this.auth);
          this.alertType = 'success';
          this.alertMsg = "You've been signed out.";
        } catch (error) {
          this.alertType = 'error';
          this.alertMsg = error.code;
        }
      } else {
        this.$refs.form.validate();
        if (this.formValid) {
          try {
            await createUserWithEmailAndPassword(this.auth, this.email, this.password);
            this.alertType = 'success';
            this.alertMsg = 'Account successfully created.';
            this.$refs.form.reset();
          } catch (error) {
            this.alertType = 'error';
            this.alertMsg = error.code;
          }
        }
      }
    },
  },
};
</script>
