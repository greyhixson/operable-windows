<template>
  <v-container>
    <v-row
      justify="center"
      dense
    >
      <v-col cols="6">
        <v-alert
          v-if="alertMessage"
          :type="alertType"
          class="text-center"
          dismissible
        >
          {{ alertMessage }}
        </v-alert>
      </v-col>
    </v-row>
    <v-container
      fill-height
      fluid
    >
      <v-row
        justify="center"
      >
        <v-col
          cols="3"
        >
          <h2> Personal Details</h2>
          <v-form>
            <v-text-field
              v-model="settings.first_name"
              label="First name"
            />
            <v-text-field
              v-model="settings.last_name"
              label="Last name"
            />
            <v-text-field
              v-model="settings.phone_number"
              label="Phone Number"
            />
          </v-form>
        </v-col>

        <v-col
          cols="3"
        >
          <h2 class="pb-2">
            Organization Settings
          </h2>
          <v-dialog
            v-model="dialog"
            persistent
            max-width="500px"
            :disabled="!alertError"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mb-2"
                v-bind="attrs"
                :disabled="alertError"
                v-on="on"
                @click="checkRegistered"
              >
                {{ orgBtnText }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">What is the name of your organization? </span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="settings.orgName"
                  label="Organization Name"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false;"
                >
                  Register
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row
        justify="center"
        class="mb-8"
      >
        <v-col cols="3">
          <h2 class="pb-2">
            Account Settings
          </h2>
          <v-row>
            <v-col>
              <v-btn
                @click="resetPassword"
              >
                Reset Password
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            dense
          >
            <v-col>
              <v-dialog
                width="500"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="red lighten-2"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    Delete my account
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2">
                    Delete my account
                  </v-card-title>

                  <v-card-text class="pt-4">
                    This operation can't be undone and will delete your account
                    and all information associated with it.
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      Delete my account
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3">
          <h2 class>
            Notification Settings
          </h2>
          <v-checkbox
            v-model="settings.text_notifications"
            label="Text Notifications"
          />
          <v-checkbox
            v-model="settings.email_notifications"
            label="Email Notifications"
          />
        </v-col>
      </v-row>
      <v-row
        justify="center"
      >
        <v-dialog
          max-width="400px"
        >
          <template
            v-slot:activator="{ on, attrs }"
          >
            <v-btn
              dark
              v-bind="attrs"
              width="300px"
              height="60px"
              v-on="on"
            >
              Exit
            </v-btn>
          </template>
          <v-card
            class="mx-auto"
          >
            <v-card-title class="text-h5">
              Save your Settings?
            </v-card-title>
            <v-card-actions
              class="pb-4"
            >
              <v-btn
                :loading="loadSaveSettings"
                @click="updateProfile"
              >
                Yes
              </v-btn>
              <v-btn
                to="/"
                @click="dialog = false"
              >
                No
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { userStore } from '@/firebase/FirebaseStore';

export default {
  name: 'Settings',
  data() {
    return {
      dialog: false,
      orgName: '',
      orgBtnText: 'Register an Organization',
      loadSaveSettings: false,
      settings: {
        first_name: '',
        last_name: '',
        phone_number: '',
        text_notifications: false,
        email_notifications: false,
        organization_name: '',
      },
      alertMessage: '',
      alert: false,
      alertType: '',
      alertError: false,
    };
  },
  watch: {
    settings() {
      if (this.settings.organization_name) {
        this.orgBtnText = 'Manage Organization';
      } else {
        this.orgBtnText = 'Register an Organization';
      }
    },
    'userStore.settings': function watchSettingsChange(settings) {
      this.settings = settings;
    },
  },
  async created() {
    if (userStore.userCredential) {
      if (!userStore.settingsLoaded) {
        await userStore.getSettings();
        this.settings = userStore.settings;
      }
      this.settings = userStore.settings;
    }
  },
  methods: {
    checkRegistered() {
      if (this.settings.organization_name && userStore.userCredential) {
        this.$router.push('/manageorg');
      } else if (!userStore.userCredential) {
        this.alertType = 'error';
        this.alertMessage = 'Please create an account to register an organization.';
        this.alert = true;
        this.alertError = true;
      }
    },
    async updateProfile() {
      this.loadSaveSettings = true;
      if (userStore.userCredential) {
        await userStore.updateSettings(this.settings);
      }
      this.loadSaveSettings = false;
      await this.$router.push('/');
    },
    resetPassword() {
      this.alertMessage = 'Check your inbox for an email to reset your password';
      this.alertType = 'info';
      this.alert = true;
      this.alertError = false;
      userStore.sendPasswordResetEmail();
    },
  },
};
</script>
