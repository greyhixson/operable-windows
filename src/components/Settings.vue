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
              v-model="dialogManageOrg"
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
                v-model="dialogDeleteAcct"
                width="500"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    ref="deleteAcctBtn"
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
                      @click="dialogDeleteAcct = false"
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
          <h2 class="pb-2">
            Notification Settings
          </h2>
          <v-dialog
            v-model="dialogManageNotif"
            width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mb-2"
                width="220px"
                v-on="on"
              >
                Manage Notifications
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Manage Notifications</span>
              </v-card-title>
              <v-card-text>
                Text
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  @click="dialogManageNotif = false;"
                >
                  Save changes
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="dialogManageNotif = false;"
                >
                  Exit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogAddNotif"
            width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mb-2"
                width="220px"
                v-on="on"
              >
                Add Notifications
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Add Notifications</span>
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="form"
                >
                  <v-row>
                    <v-checkbox
                      v-model="notification.textNotification"
                      label="Text Notification"
                    />
                    <v-checkbox
                      v-model="notification.emailNotification"
                      class="pl-4"
                      label="Email Notification"
                    />
                  </v-row>
                  <v-autocomplete
                    v-model="notification.orgSelect"
                    label="Select an organization"
                    :items="orgs"
                    clearable
                    return-object
                    :search-input.sync="orgSearch"
                    :filter="onOrgFilter"
                  >
                    <template v-slot:selection="{ item }">
                      <span>{{ item.organization }}</span>
                    </template>
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.organization" />
                        <v-list-item-subtitle v-text="item.city" />
                        <v-list-item-subtitle v-text="item.state" />
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                  <v-autocomplete
                    v-model="notification.spaceSelect"
                    label="Select a space"
                    :items="spaces"
                    clearable
                    return-object
                    :search-input.sync="spaceSearch"
                    :filter="onSpaceFilter"
                  >
                    <template v-slot:selection="{ item }">
                      <span>{{ item.space }}</span>
                    </template>
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.space" />
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                  <v-text-field
                    v-model="notification.startTime"
                    label="Start time"
                    type="time"
                  />
                  <v-text-field
                    v-model="notification.endTime"
                    label="End time"
                    type="time"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  @click="saveNotification"
                >
                  Save notification
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="exitNotification"
                >
                  Exit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
  newOrg, getOrg, getAllOrgs, deleteOrg, APIkey,
  updateSettings, sendPasswordResetEmail, deleteUser, deleteUserSettings, getAllSpaces,
} from '@/store/FirebaseStore';

import userStore from '@/store/UserStore';

export default {
  name: 'Settings',
  data() {
    return {
      dialogManageOrg: false,
      dialogDeleteAcct: false,
      dialogAddNotif: false,
      dialogManageNotif: false,
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
        notifications: [],
        organization_name: '',
        favorite_space: '',
      },
      alertMessage: '',
      alert: false,
      alertType: '',
      showAlert: false,
      alertError: false,
      userStore,
      orgs: [],
      spaces: [],
      orgSearch: null,
      spaceSearch: null,
      notification: {
        textNotification: null,
        emailNotification: null,
        orgSelect: null,
        spaceSelect: null,
        startTime: null,
        endTime: null,
      },
    };
  },
  watch: {
    'userStore.settings': {
      handler(settings) {
        this.settings = settings;
        if (settings.organization_name) {
          this.orgBtnText = 'Manage Organization';
        } else {
          this.orgBtnText = 'Register Organization';
        }
      },
      deep: true,
    },
    'notification.orgSelect': async function watchOrgSelect(orgSelect) {
      if (orgSelect) {
        const { organization } = orgSelect;
        this.spaces = await getAllSpaces(organization);
      }
    },
    dialogManageOrg() {
      // Blur bug fix
      this.$refs.orgBtn.$el.blur();
    },
    dialogDeleteAcct() {
      // Blur bug fix
      this.$refs.deleteAcctBtn.$el.blur();
    },
    async dialogAddNotif() {
      if (this.orgs.length === 0) {
        this.orgs = await getAllOrgs();
      }
    },
  },
  async created() {
    if (userStore.userCredential) {
      this.settings = userStore.settings;
      if (this.userStore.settings.organization_name) {
        this.orgBtnText = 'Manage Organization';
      } else {
        this.orgBtnText = 'Register Organization';
      }
    }
  },
  methods: {
    checkRegistered() {
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
                await newOrg(this.org);
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
      this.dialogManageOrg = false;
    },
    async updateProfile() {
      this.loadSaveSettings = true;
      if (userStore.userCredential) {
        userStore.settings = this.settings;
        await updateSettings();
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
        if (userStore.settings.organization_name) {
          deleteOrg(userStore.settings.organization_name);
        }
        deleteUserSettings();
        userStore.userCredential = null;
        deleteUser();
        this.$router.push('/');
      }
    },
    saveNotification() {
      this.settings.notifications.push(this.notification);
      this.dialogAddNotif = false;
      this.alertError = true;
      this.alertType = 'success';
      this.alertMessage = 'Successfully added notification.';
      this.showAlert = true;
    },
    exitNotification() {
      this.$refs.form.reset();
      this.dialogAddNotif = false;
    },
    onOrgFilter(item, queryText) {
      const { organization, state, city } = item;
      return organization.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
          || state.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
          || city.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
    },
    onSpaceFilter(item, queryText) {
      const { space } = item;
      return space.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
    },
  },
};
</script>
