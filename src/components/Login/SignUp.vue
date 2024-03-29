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
            outlined
          />
          <v-text-field
            v-model="password"
            type="password"
            placeholder="Password"
            label="Please enter your password"
            :rules="passwordRules"
            outlined
          />
          <v-text-field
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            label="Please confirm your password"
            :rules="comparePasswordsRules"
            outlined
          />
        </v-form>
        <v-row no-gutters>
          <v-col>
            <v-btn
              class="mr-2"
              min-height="45"
              elevation="1"
              block
              @click="accountBtn"
            >
              {{ accountBtnText }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="ml-2"
              min-height="45"
              elevation="1"
              to="/"
              block
            >
              Home
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  createUserWithEmailAndPassword, getAuth, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/store/store';
import AlertBanner from '@/components/AlertBanner.vue';

export default {
  name: 'SignUp',
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
      accountBtnText: 'Create Account',
      email: '',
      emailRules: [
        (v) => !!v || 'Email is required',
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length) >= 6 || 'Password must be at least 6 characters long',
      ],
      confirmPassword: '',
      comparePasswordsRules: [
        (v) => !!v || 'Confirm password is required',
        (v) => v === this.password || 'Passwords do not match',
      ],
    };
  },
  computed: {
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
        this.accountBtnText = 'Create Account';
      }
    });
  },
  methods: {
    async accountBtn() {
      // If the user is signed in, sign them out
      if (this.auth.currentUser) {
        try {
          await signOut(this.auth);
          this.setAlert('success', "You've been signed out.");
        } catch (error) {
          this.setAlert('error', error.code);
        }
        // If the user is signed out, create an account
      } else {
        this.$refs.form.validate();
        if (this.validForm) {
          try {
            await createUserWithEmailAndPassword(this.auth, this.email, this.password);
            const { uid } = this.auth.currentUser;
            await setDoc(doc(db, 'users', uid), {
              favorite: {
                orgName: '',
                spaceName: '',
              },
              ownedOrgName: '',
            });
            this.setAlert('success', 'Account successfully created.');
            this.$refs.form.reset();
          } catch (error) {
            this.setAlert('error', error.code);
          }
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
