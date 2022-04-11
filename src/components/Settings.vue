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
          v-if="auth.currentUser"
          cols="auto"
          xs="1"
          xl="3"
        >
          <h2> Personal</h2>
          <v-text-field
            v-model="auth.currentUser.phoneNumber"
            class="readonlyField"
            label="Phone Number"
            readonly
          />
          <v-text-field
            v-model="auth.currentUser.email"
            class="readonlyField"
            label="Email Address"
            readonly
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
            append-outer-icon="mdi-close-circle"
            label="Favorite Organization"
            class="readonlyField"
            @click:append-outer="clearFavoriteOrg"
          />

          <v-text-field
            v-model="settings.favorite.spaceName"
            readonly
            append-outer-icon="mdi-close-circle"
            label="Favorite Space"
            class="readonlyField"
            @click:append-outer="clearFavoriteSpace"
          />
        </v-col>
      </v-row>
      <v-row
        v-if="auth.currentUser"
        justify="center"
        class="mb-8 mx-auto"
      >
        <v-col
          cols="auto"
          xs="1"
          xl="3"
        >
          <h2 class="pb-2">
            Account Settings
          </h2>
          <v-row
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
          <v-row dense>
            <v-col>
              <v-dialog
                v-model="dialogAddNotif"
                width="500px"
                persistent
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    ref="addNotifBtn"
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
                      v-model="notificationFormValid"
                    >
                      <v-autocomplete
                        v-model="orgSelect"
                        label="Select an organization"
                        :items="orgs"
                        clearable
                        return-object
                        :search-input.sync="orgSearch"
                        :filter="onOrgFilter"
                        required
                        :rules="requiredRule"
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
                        v-model="spaceSelect"
                        label="Select a space"
                        :items="spaces"
                        clearable
                        return-object
                        :search-input.sync="spaceSearch"
                        :filter="onSpaceFilter"
                        required
                        :rules="requiredRule"
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
                      <v-row />
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      text
                      @click="saveAddNotification"
                    >
                      Save notification
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="exitAddNotification"
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
                v-model="dialogManageNotif"
                width="900px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    ref="manageNotifBtn"
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
                      :items="notifications"
                      :hide-default-footer="true"
                      class="elevation-1"
                    >
                      <template v-slot:item.enabled="{ item }">
                        <v-simple-checkbox
                          v-model="item.enabled"
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
                      Save
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
        </v-col>
      </v-row>
      <v-row
        justify="center"
      >
        <v-btn
          dark
          width="200px"
          height="50px"
          to="/"
        >
          Exit
        </v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<style>
.readonlyField.v-text-field>.v-input__control>.v-input__slot:before {
  border-style: none;
}
.readonlyField.v-text-field>.v-input__control>.v-input__slot:after {
  border-style: none;
}
</style>

<script>
import { APIkey } from '@/store/store';
import {
  getAuth, onAuthStateChanged, sendPasswordResetEmail,
} from 'firebase/auth';
import AlertBanner from '@/components/AlertBanner.vue';
import {
  getUser, getOrg, getAllOrgs, writeOrg, deleteUser, getAllSpaces, addNotification, getUserNotifications,
  writeUserSettings, writeNotifications,
} from '@/API/firestoreAPI';

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
      notificationFormValid: false,
      dialog: false,
      orgSelect: null,
      spaceSelect: null,
      registerOrgObj: {
        name: '',
        city: '',
        state: '',
      },
      requiredRule: [
        (v) => !!v || 'Required',
      ],
      orgBtnText: 'Register Organization',
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
        { text: 'Enabled', value: 'enabled' },
        { text: 'Organization', value: 'orgName' },
        { text: 'Space', value: 'spaceName' },
        { text: 'Delete', value: 'actions', sortable: false },
      ],
      notifications: [],
      notification: {
        orgName: '',
        spaceName: '',
        enabled: false,
      },
    };
  },
  computed: {
    auth() {
      return getAuth();
    },
  },
  watch: {
    dialogManageOrg() {
      // Blur bug fix
      this.$refs.orgBtn.$el.blur();
    },
    dialogDeleteAcct() {
      // Blur bug fix
      this.$refs.deleteAcctBtn.$el.blur();
    },
    dialogManageNotif() {
      this.$refs.manageNotifBtn.$el.blur();
    },
    async dialogAddNotif() {
      if (this.orgs.length === 0) {
        try {
          this.orgs = await getAllOrgs();
        } catch (error) {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      }
      this.$refs.addNotifBtn.$el.blur();
    },
    async orgSelect() {
      if (this.orgSelect) {
        const { name } = this.orgSelect;
        this.notification.orgName = name;
        this.spaces = await getAllSpaces(name);
      } else {
        this.spaceSelect = null;
        this.notification.spaceName = null;
      }
    },
    async spaceSelect() {
      if (this.spaceSelect) {
        const { name } = this.spaceSelect;
        this.notification.spaceName = name;
      } else {
        this.notification.spaceName = '';
      }
    },
  },
  async mounted() {
    const { auth } = this;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userObj = await getUser(user.uid);
          this.notifications = await getUserNotifications(user.uid);
          if (userObj) {
            const { ownedOrgName } = userObj;
            const { orgName, spaceName } = userObj.favorite;
            if (orgName) {
              this.settings.favorite.orgName = orgName;
            }
            if (spaceName) {
              this.settings.favorite.spaceName = spaceName;
            }
            if (ownedOrgName) {
              this.orgBtnText = 'Manage Organization';
              this.settings.ownedOrgName = ownedOrgName;
            } else {
              this.orgBtnText = 'Register Organization';
            }
          }
        } catch (error) {
          console.log(error);
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      }
    });
  },
  methods: {
    checkRegistered() {
      if (this.auth.currentUser && this.settings.ownedOrgName) {
        this.$router.push('/manageorg');
      }
    },
    async registerOrg() {
      const { city, state, name } = this.registerOrgObj;
      const orgDoc = await getOrg(name);
      if (!orgDoc.exists() && this.auth.currentUser) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},
        US&appid=${APIkey}&units=imperial`)
          .then((response) => response.json())
          .then(async (weather) => {
            const { main } = weather;
            if (main) {
              await writeOrg(this.registerOrgObj, this.auth.currentUser.uid);
              this.settings.ownedOrgName = name;
              this.orgBtnText = 'Manage Organization';
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
    async resetPassword() {
      if (this.auth.currentUser) {
        this.setAlert('info', 'Check your inbox for an email to reset your password');
        await sendPasswordResetEmail(this.auth, this.auth.currentUser.email);
      }
    },
    async deleteAccount() {
      try {
        await deleteUser(this.auth.currentUser, this.settings.ownedOrgName);
      } catch {
        this.setAlert('error', 'An error has occurred, please try again later.');
      }
    },
    async saveAddNotification() {
      await this.$refs.form.validate();
      this.notification.enabled = true;
      const notifCopy = JSON.parse(JSON.stringify(this.notification));
      if (this.notificationFormValid) {
        this.dialogAddNotif = false;
        try {
          await addNotification(notifCopy, this.auth.currentUser.uid);
          this.setAlert('success', 'Successfully added notification.');
          this.notifications.push(notifCopy);
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
        this.$refs.form.reset();
      }
    },
    exitAddNotification() {
      this.dialogAddNotif = false;
      this.$refs.form.reset();
    },
    deleteNotification(item) {
      const deleteNotifIndex = this.notifications.indexOf(item);
      this.notifications.splice(deleteNotifIndex, 1);
    },
    async saveNotificationManager() {
      this.dialogManageNotif = false;
      const notifsCopy = JSON.parse(JSON.stringify(this.notifications));
      try {
        await writeNotifications(notifsCopy, this.auth.currentUser.uid);
        this.setAlert('success', 'Successfully saved your notifications.');
      } catch {
        this.setAlert('error', 'An error has occurred, please try again later.');
      }
    },
    async exitNotificationManager() {
      this.dialogManageNotif = false;
      if (this.auth.currentUser) {
        try {
          const { uid } = this.auth.currentUser;
          this.notifications = await getUserNotifications(uid);
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      }
    },
    clearFavoriteOrg() {
      this.settings.favorite.orgName = '';
      this.settings.favorite.spaceName = '';
      this.writeSettings();
    },
    clearFavoriteSpace() {
      this.settings.favorite.spaceName = '';
      this.writeSettings();
    },
    async writeSettings() {
      if (this.auth.currentUser) {
        try {
          const { uid } = this.auth.currentUser;
          const settings = JSON.parse(JSON.stringify(this.settings));
          console.log(settings);
          await writeUserSettings(settings, uid);
          this.setAlert('success', 'Successfully saved your settings.');
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      }
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
