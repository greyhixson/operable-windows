<template>
  <v-container>
    <v-row
      justify="center"
      dense
    >
      <v-col
        cols="auto"
        xs="2"
        xl="6"
      >
        <alert-banner
          v-if="alert.msg && alert.type"
          :alert-msg="alert.msg"
          :alert-type="alert.type"
          :show-alert-prop="alert.show"
          @resetAlert="resetAlert"
        />
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
          cols="auto"
          xs="1"
          xl="3"
        >
          <h2> Personal Details</h2>
          <v-text-field
            v-model="settings.phone_number"
            label="Phone Number"
          />
        </v-col>
        <v-col
          cols="auto"
          xs="1"
          xl="3"
        >
          <h2>
            Organization Settings
          </h2>
          <v-text-field
            v-model="settings.favorite.orgName"
            readonly
            label="Favorite Organization"
          />

          <v-text-field
            v-model="settings.favorite.spaceName"
            readonly
            label="Favorite Space"
          />
        </v-col>
      </v-row>
      <v-row
        justify="center"
        class="mb-8 mx-auto"
      >
        <v-col
          cols="auto"
          xs="1"
          xl="3"
        >
          <h2 class="pb-2">
            {{ loggedIn ? 'Account Settings' : 'General Settings' }}
          </h2>
          <v-row
            v-if="loggedIn"
            dense
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
            v-if="loggedIn"
            dense
          >
            <v-col>
              <v-dialog
                v-model="dialogManageOrg"
                persistent
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    ref="orgBtn"
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
                      v-model="registerOrgObj.name"
                      label="Organization Name"
                    />
                    <v-text-field
                      v-model="registerOrgObj.city"
                      label="Organization City"
                    />
                    <v-text-field
                      v-model="registerOrgObj.state"
                      label="Organization State"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="dialogManageOrg = false;"
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
            </v-col>
          </v-row>
          <v-row
            v-if="loggedIn"
            dense
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
        <v-col
          cols="auto"
          xs="1"
          xl="3"
        >
          <h2 class="pb-2">
            Notification Settings
          </h2>
          <v-row>
            <v-col>
              <v-dialog
                v-model="dialogManageNotif"
                width="900px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
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
                    <v-data-table
                      :headers="headers"
                      :items="settings.notifications"
                      :hide-default-footer="true"
                      class="elevation-1"
                    >
                      <template v-slot:item.emailNotification="{ item }">
                        <v-simple-checkbox
                          v-model="item.emailNotification"
                          :ripple="false"
                        />
                      </template>
                      <template v-slot:item.textNotification="{ item }">
                        <v-simple-checkbox
                          v-model="item.textNotification"
                          :ripple="false"
                        />
                      </template>
                      <template v-slot:item.actions="{ item }">
                        <v-icon
                          small
                          @click="deleteNotification(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-data-table>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      text
                      @click="saveNotificationManager"
                    >
                      Save changes
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="exitNotificationManager"
                    >
                      Exit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-dialog
                v-model="dialogAddNotif"
                width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    width="220px"
                    v-on="on"
                  >
                    Add Notification
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Add Notification</span>
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
                          <span>{{ item.name }}</span>
                        </template>
                        <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title v-text="item.name" />
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
                          <span>{{ item.name }}</span>
                        </template>
                        <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title v-text="item.name" />
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
              class="pb-2"
            >
              <v-btn
                :loading="loadSaveSettings"
                @click="saveSettings"
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

import { APIkey, db } from '@/store/store';
import {
  getAuth, onAuthStateChanged, sendPasswordResetEmail, deleteUser,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, deleteDoc,
} from 'firebase/firestore';
import AlertBanner from '@/components/AlertBanner.vue';

export default {
  name: 'Settings',
  components: {
    AlertBanner,
  },
  data() {
    return {
      dialogManageOrg: false,
      dialogDeleteAcct: false,
      dialogAddNotif: false,
      dialogManageNotif: false,
      dialog: false,
      registerOrgObj: {
        name: '',
        city: '',
        state: '',
      },
      orgBtnText: 'Register Organization',
      loadSaveSettings: false,
      settings: {
        favorite: {
          orgName: '',
          spaceName: '',
        },
        ownedOrgName: '',
      },
      alert: {
        type: '',
        msg: '',
        show: false,
      },
      orgs: [],
      spaces: [],
      orgSearch: null,
      spaceSearch: null,
      headers: [
        { text: 'Emails', value: 'emailNotification' },
        { text: 'Texts', value: 'textNotification' },
        { text: 'Organization', value: 'orgSelect.organization' },
        { text: 'Space', value: 'spaceSelect.space' },
        { text: 'Start Time', value: 'startTime' },
        { text: 'End Time', value: 'endTime' },
        { text: 'Delete', value: 'actions', sortable: false },
      ],
      notification: {
        orgName: '',
        orgSpace: '',
        times: [],
        type: {
          email: false,
          text: false,
        },
      },
      ownsOrg: false,
      loggedIn: false,
    };
  },
  computed: {
    auth() {
      return getAuth();
    },
  },
  watch: {
    'user.settings': {
      handler(settings) {
        this.settings = JSON.parse(JSON.stringify(settings));
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
  async mounted() {
    const { auth } = this;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.loggedIn = true;
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userObj = userDoc.data();
            if (userObj.ownedOrgName) {
              this.orgBtnText = 'Manage Organization';
              this.ownsOrg = true;
            } else {
              this.orgBtnText = 'Register Organization';
            }
          }
        } catch (error) {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      } else {
        this.loggedIn = false;
        this.ownsOrg = false;
      }
    });
  },
  methods: {
    checkRegistered() {
      if (this.loggedIn && this.ownsOrg) {
        this.$router.push('/manageorg');
      }
    },
    async registerOrg() {
      const { city, state, name } = this.registerOrgObj;
      const orgKey = this.getInputKey(name);
      const orgRef = doc(db, 'organizations', orgKey);
      if (!orgRef && this.loggedIn) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},
        US&appid=${APIkey}&units=imperial`)
          .then((response) => response.json())
          .then(async (weather) => {
            const { main } = weather;
            if (main) {
              await setDoc(doc(db, 'organizations', orgKey), {
                name,
                city,
                state,
              });
              this.settings.ownedOrgName = name;
              await this.saveUserSettings(this.settings);
              this.setAlert('success', 'Successfully registered organization.');
            } else {
              this.setAlert('error', weather.message);
            }
          });
      } else {
        this.setAlert('error', 'Organization already exists.');
      }
      this.dialogManageOrg = false;
    },
    async saveUserSettings(settings) {
      this.loadSaveSettings = true;
      const userRef = doc(db, 'users', this.auth.currentUser.uid);
      await setDoc(userRef, {
        favorites: settings.favorites,
        ownedOrgName: settings.ownedOrgName,
      });
      this.loadSaveSettings = false;
    },
    async resetPassword() {
      if (this.loggedIn) {
        this.setAlert('info', 'Check your inbox for an email to reset your password');
        await sendPasswordResetEmail(this.auth, this.auth.currentUser.email);
      }
    },
    async deleteAccount() {
      if (this.loggedIn) {
        try {
          if (this.settings.ownedOrgName) {
            const userRef = doc(db, 'users', this.auth.currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const { ownedOrgName } = userDoc.data();
              if (ownedOrgName) {
                const orgKey = this.getInputKey(ownedOrgName);
                await deleteDoc(doc(db, 'organizations', orgKey));
              }
            }
          }
          await deleteDoc(doc(db, 'users', this.auth.currentUser.uid));
        } catch (error) {
          this.setAlert('error', error.message);
        }
        await deleteUser(this.auth.currentUser);
      }
    },
    async saveNotification() {
      try {
        await setDoc(doc(db, 'notifications', this.auth.currentUser.uid), {
          orgName: this.notification.orgName,
          orgSpace: this.notification.orgSpace,
          times: this.times,
          type: this.type,
        });
        this.setAlert('success', 'Successfully added notification.');
      } catch (error) {
        this.setAlert('error', error.message);
      }
      this.dialogAddNotif = false;
    },
    exitNotification() {
      this.$refs.form.reset();
      this.dialogAddNotif = false;
    },
    deleteNotification(item) {
      const deleteNotifIndex = this.settings.notifications.indexOf(item);
      this.settings.notifications.splice(deleteNotifIndex, 1);
    },
    async saveNotificationManager() {
      user.settings.notifications = JSON.parse(JSON.stringify(this.settings.notifications));
      this.dialogManageNotif = false;
    },
    exitNotificationManager() {
      this.settings.notifications = JSON.parse(JSON.stringify(user.settings.notifications));
      this.dialogManageNotif = false;
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
    getInputKey(input) {
      return input?.toLowerCase().replace(/\s+/g, '');
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
