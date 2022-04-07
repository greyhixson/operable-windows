<template>
  <v-container>
    <v-row
      justify="center"
      dense
    >
      <v-col cols="6">
        <v-alert
          v-if="alertMessage"
          v-model="showAlert"
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
        </v-col>
        <v-col
          cols="3"
        >
          <h2>
            Organization Settings
          </h2>
          <v-text-field
            v-model="settings.favorite_organization"
            readonly
            label="Favorite Organization"
          />

          <v-text-field
            v-model="settings.favorite_space"
            readonly
            label="Favorite Space"
          />
        </v-col>
      </v-row>
      <v-row
        justify="center"
        class="mb-8 mx-auto"
      >
        <v-col cols="3">
          <h2 class="pb-2">
            {{ userStore.userCredential ? 'Account Settings' : 'General Settings' }}
          </h2>
          <v-row
            v-if="userStore.userCredential"
            no-gutters
            class="pb-2"
          >
            <v-col>
              <v-btn
                width="220px"
                @click="resetPassword"
              >
                Reset Password
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            v-if="userStore.userCredential"
            no-gutters
          >
            <v-dialog
              v-model="dialog"
              persistent
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  ref="orgBtn"
                  class="mb-2"
                  v-bind="attrs"
                  width="220px"
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
                    v-model="org.organization"
                    label="Organization Name"
                  />
                  <v-text-field
                    v-model="org.city"
                    label="Organization City"
                  />
                  <v-text-field
                    v-model="org.state"
                    label="Organization State"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false;"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="registerOrg"
                  >
                    Register
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
          <v-row
            no-gutters
            class="pb-2"
          >
            <v-col>
              <v-btn
                width="220px"
                @click="clearFavorites"
              >
                Clear Favorites
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            v-if="userStore.userCredential"
            no-gutters
            class="pb-2"
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
                    width="220px"
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
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="deleteAccount"
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
                @click="dialog = false;"
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
import {
  newOrg, getOrg, deleteOrg, APIkey,
  getSettings, updateSettings, sendPasswordResetEmail, deleteUser, deleteUserSettings,
} from '@/store/FirebaseStore';

import userStore from '@/store/UserStore';

export default {
  name: 'Settings',
  data() {
    return {
      dialog: false,
      org: {
        organization: '',
        city: '',
        state: '',
      },
      orgBtnText: 'Register Organization',
      loadSaveSettings: false,
      settings: {
        first_name: '',
        last_name: '',
        phone_number: '',
        favorite_organization: '',
        text_notifications: false,
        email_notifications: false,
        organization_name: '',
        favorite_space: '',
      },
      alertMessage: '',
      alert: false,
      alertType: '',
      showAlert: false,
      alertError: false,
      userStore,
    };
  },
  watch: {
    'settings.organization_name': function watchOrgName(orgName) {
      if (orgName) {
        this.orgBtnText = 'Manage Organization';
      } else {
        this.orgBtnText = 'Register Organization';
      }
    },
    dialog() {
      // Bug fix for the orgBtn that stays focused;
      this.$refs.orgBtn.$el.blur();
    },
  },
  async created() {
    if (userStore.userCredential) {
      this.settings = await getSettings();
    }
  },
  methods: {
    checkRegistered() {
      console.log(this.settings);
      if (this.settings.organization_name && userStore.userCredential) {
        this.$router.push('/manageorg');
      }
    },
    async registerOrg() {
      if (!await getOrg(this.org.organization)) {
        if (userStore.userCredential) {
          const { city, state } = this.org;
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},
        US&appid=${APIkey}&units=imperial`)
            .then((response) => response.json())
            .then(async (weather) => {
              const { main } = weather;
              if (main) {
                console.log(main);
                await newOrg(this.org);
                this.settings.organization_name = this.org.organization;
                await updateSettings(this.settings);
                this.alertError = false;
                this.alertType = 'success';
                this.alertMessage = 'Successfully registered organization.';
                this.showAlert = true;
              } else {
                this.alertError = true;
                this.alertType = 'error';
                this.alertMessage = weather.message;
                this.showAlert = true;
              }
            });
        }
      } else {
        this.alertError = true;
        this.alertType = 'error';
        this.alertMessage = 'Organization already exists.';
        this.showAlert = true;
      }
      this.dialog = false;
    },
    async updateProfile() {
      this.loadSaveSettings = true;
      if (userStore.userCredential) {
        await updateSettings(this.settings);
      }
      this.loadSaveSettings = false;
      await this.$router.push('/');
    },
    resetPassword() {
      this.alertMessage = 'Check your inbox for an email to reset your password';
      this.alertType = 'info';
      this.alert = true;
      this.alertError = false;
      sendPasswordResetEmail();
    },
    clearFavorites() {
      this.settings.favorite_organization = '';
      this.settings.favorite_space = '';
    },
    deleteAccount() {
      if (userStore.userCredential) {
        getSettings();
        if (userStore.settings.organization_name) {
          deleteOrg(userStore.settings.organization_name);
        }
        deleteUserSettings();
        userStore.userCredential = null;
        deleteUser();
        this.$router.push('/');
      }
    },
  },
};
</script>
