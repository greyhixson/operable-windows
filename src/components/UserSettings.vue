<template>
  <v-container>
    <v-row justify="center">
      <v-col
        xs="12"
        sm="10"
        md="9"
        lg="7"
        xl="5"
      >
        <v-row
          justify="center"
        >
          <v-col>
            <alert-banner
              v-if="alert.msg && alert.type"
              :alert-msg="alert.msg"
              :alert-type="alert.type"
              :show-alert-prop="alert.show"
              @resetAlert="resetAlert"
            />
          </v-col>
        </v-row>
        <v-container>
          <v-row
            no-gutters
            class="mr-8 ml-8"
          >
            <v-col>
              <h2>Personal</h2>
              <v-text-field
                :value="settings.phoneNumber"
                class="readonlyField"
                label="Phone Number"
                type="number"
                readonly
                style="width: 200px"
              />
              <v-text-field
                :value="email"
                class="readonlyField"
                label="Email Address"
                readonly
                style="width: 200px"
              />
            </v-col>
            <v-col>
              <h2>
                Organization
              </h2>
              <v-text-field
                v-model="settings.favorite.orgName"
                append-outer-icon="mdi-close-circle"
                label="Favorite Organization"
                class="readonlyField"
                readonly
                @click:append-outer="clearFavoriteOrg"
              />

              <v-text-field
                v-model="settings.favorite.spaceName"
                append-outer-icon="mdi-close-circle"
                label="Favorite Space"
                class="readonlyField"
                readonly
                @click:append-outer="clearFavoriteSpace"
              />
            </v-col>
          </v-row>
          <v-row
            justify="center"
            class="ml-8 mb-8 mr-8"
            no-gutters
          >
            <v-col>
              <h2 class="pb-2">
                Account
              </h2>
              <v-row dense>
                <v-col cols="8">
                  <v-dialog
                    v-model="dialogManageOrg"
                    persistent
                    max-width="500px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        block
                        width="225px"
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
                <v-col cols="8">
                  <v-btn
                    color="primary"
                    block
                    width="225px"
                    @click="resetPassword"
                  >
                    Reset Password
                  </v-btn>
                </v-col>
              </v-row>
              <v-row
                dense
              >
                <v-col cols="8">
                  <v-dialog
                    v-model="phoneNumberDialog"
                    max-width="500px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        v-bind="attrs"
                        block
                        width="225px"
                        v-on="on"
                      >
                        Update Phone Number
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Please enter your phone number</span>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="phoneNumber"
                          label="Phone Number"
                          type="number"
                          hint="This will be the phone number that will receive any saved text notifications."
                          persistent-hint
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="phoneNumberDialog = false;"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="savePhoneNumber"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row
                dense
              >
                <v-col cols="8">
                  <v-dialog
                    v-model="dialogDeleteAcct"
                    max-width="500px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        color="red lighten-2"
                        dark
                        v-bind="attrs"
                        block
                        width="225px"
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
            <v-col>
              <h2 class="pb-2">
                Notification
              </h2>
              <v-row dense>
                <v-col cols="8">
                  <v-dialog
                    v-model="dialogAddNotif"
                    max-width="500px"
                    persistent
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="settings.phoneNumber ? attrs : null"
                        block
                        width="225px"
                        v-on="settings.phoneNumber ? on : null"
                        @click="checkIfPhoneNumber"
                      >
                        Add Text Notification
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Add Text Notification</span>
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
                            hint="The organization that you want to select a space from."
                            persistent-hint
                            hide-no-data
                            outlined
                            prepend-inner-icon="mdi-domain"
                          >
                            <template #selection="{ item }">
                              <span>{{ item.name }}</span>
                            </template>
                            <template #item="{ item }">
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
                            hint="The space your operable window is in."
                            no-data-text="Please select an organization first."
                            persistent-hint
                            outlined
                            prepend-inner-icon="mdi-home-search"
                          >
                            <template #selection="{ item }">
                              <span>{{ item.name }}</span>
                            </template>
                            <template #item="{ item }">
                              <v-list-item-content>
                                <v-list-item-title v-text="item.name" />
                              </v-list-item-content>
                            </template>
                          </v-autocomplete>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="notification.sendTime"
                                type="time"
                                prepend-inner-icon="mdi-clock-outline"
                                hint="The time you'll be notified."
                                persistent-hint
                                :rules="requiredRule"
                                outlined
                              />
                            </v-col>
                            <v-col>
                              <v-select
                                v-model="notification.repeatDays"
                                label="Repeats on"
                                :items="days"
                                multiple
                                prepend-inner-icon="mdi-repeat"
                                hint="Days the notification will be sent."
                                persistent-hint
                                :rules="requiredRule"
                                outlined
                              >
                                <template
                                  #selection="{ item, index }"
                                >
                                  <span v-if="index === 0">{{ item }} </span>
                                  <span
                                    v-if="index === 1"
                                    class="grey--text text-caption"
                                  >(+{{ notification.repeatDays.length - 1 }} others)
                                  </span>
                                </template>
                              </v-select>
                            </v-col>
                            <v-row>
                              <v-col class="pl-6">
                                <v-menu
                                  v-model="startDateMenu"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  offset-y
                                >
                                  <template #activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="notification.startDate"
                                      label="Start Date"
                                      prepend-inner-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      hint="The first day the notification will be sent."
                                      persistent-hint
                                      :rules="requiredRule"
                                      outlined
                                      v-on="on"
                                    />
                                  </template>
                                  <v-date-picker
                                    v-model="notification.startDate"
                                    show-current
                                    :min="new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' )"
                                    no-title
                                    @input="startDateMenu = false"
                                  />
                                </v-menu>
                              </v-col>
                              <v-col class="pr-6">
                                <v-menu
                                  v-model="endDateMenu"
                                  :close-on-content-click="false"
                                  :nudge-left="100"
                                  offset-y
                                >
                                  <template #activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="notification.endDate"
                                      label="End Date"
                                      prepend-inner-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      hint="The last day the notification will be sent."
                                      persistent-hint
                                      :rules="requiredRule"
                                      outlined
                                      v-on="on"
                                    />
                                  </template>
                                  <v-date-picker
                                    v-model="notification.endDate"
                                    no-title
                                    @input="endDateMenu = false"
                                  />
                                </v-menu>
                              </v-col>
                            </v-row>
                          </v-row>
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
                <v-col cols="8">
                  <v-dialog
                    v-model="dialogManageNotif"
                    max-width="900px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        block
                        width="225px"
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
                          <template #[`item.enabled`]="{ item }">
                            <v-simple-checkbox
                              v-model="item.enabled"
                              :ripple="false"
                            />
                          </template>
                          <template #[`item.actions`]="{ item }">
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
          <v-divider class="pb-8 mt-n2" />
          <v-row
            justify="center"
          >
            <v-btn
              height="50px"
              to="/"
              width="250px"
            >
              Exit
            </v-btn>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import AlertBanner from '@/components/AlertBanner.vue';
import {
  addNotification,
  deleteUser,
  getAllOrgs,
  getAllSpaces,
  getOrg,
  getUser,
  getUserNotifications,
  writeNotifications,
  writeOrg,
  writeUserSettings,
} from '@/API/firestoreAPI';
import { getWeather } from '@/API/weatherAPI';

export default {
  name: 'UserSettings',
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
      phoneNumberDialog: false,
      dialog: false,
      startDateMenu: false,
      endDateMenu: false,
      orgSelect: null,
      spaceSelect: null,
      phoneNumber: null,
      registerOrgObj: {
        name: '',
        city: '',
        state: '',
      },
      email: '',
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
        phoneNumber: '',
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
        { text: 'Start Date', value: 'startDate' },
        { text: 'End Date', value: 'endDate' },
        { text: 'Send Time', value: 'sendTime' },
        { text: 'Delete', value: 'actions', sortable: false },
      ],
      notifications: [],
      days: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      notification: {
        orgName: '',
        spaceName: '',
        enabled: false,
        sendTime: '',
        timezoneOffset: '',
        startDate: '',
        endDate: '',
        repeatDays: [],
        phoneNumber: '',
      },
    };
  },
  computed: {
    auth() {
      return getAuth();
    },
  },
  watch: {
    async dialogAddNotif() {
      // Load orgs when 'Add Text Notification' is clicked
      if (this.orgs.length === 0) {
        try {
          this.orgs = await getAllOrgs();
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      }
    },
    // Load spaces when an org is selected in the 'Add Text Notification' dialog
    async orgSelect() {
      if (this.orgSelect) {
        const { name } = this.orgSelect;
        this.notification.orgName = name;
        this.spaces = await getAllSpaces(name);
      } else {
        this.spaces = null;
        this.spaceSelect = null;
        this.notification.spaceName = null;
      }
    },
    // Save space from the 'Add Text Notification' dialog in a notification obj
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
      // Get the user's settings
      if (user) {
        try {
          const userObj = await getUser(user.uid);
          this.email = user.email;
          this.notifications = await getUserNotifications(user.uid);
          if (userObj) {
            const { ownedOrgName, phoneNumber } = userObj;
            const { orgName, spaceName } = userObj.favorite;
            if (orgName) {
              this.settings.favorite.orgName = orgName;
            }
            if (spaceName) {
              this.settings.favorite.spaceName = spaceName;
            }
            if (phoneNumber) {
              this.settings.phoneNumber = phoneNumber;
            }
            if (ownedOrgName) {
              this.orgBtnText = 'Manage Organization';
              this.settings.ownedOrgName = ownedOrgName;
            } else {
              this.orgBtnText = 'Register Organization';
            }
          }
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      } else {
        await this.$router.push('/').catch(() => {});
      }
    });
  },
  methods: {
    checkRegistered() {
      if (this.auth.currentUser && this.settings.ownedOrgName) {
        this.$router.push('/manageorg').catch(() => {});
      }
    },
    async registerOrg() {
      const { city, state, name } = this.registerOrgObj;
      const orgDoc = await getOrg(name);
      // Check if an org isn't yet registered and then check if it is valid by getting the weather data
      if (!orgDoc.exists() && this.auth.currentUser) {
        try {
          const weatherResponse = await getWeather(city, state);
          const { main } = weatherResponse;
          if (main) {
            try {
              await writeOrg(this.registerOrgObj, this.auth.currentUser.uid);
              this.settings.ownedOrgName = name;
              this.orgBtnText = 'Manage Organization';
              this.setAlert('success', 'Successfully registered organization.');
            } catch {
              this.setAlert('error', 'An error has occurred, please try again later.');
            }
          } else {
            this.setAlert('error', weatherResponse.message);
          }
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
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
        await deleteUser(this.auth.currentUser);
      } catch {
        this.setAlert('error', 'An error has occurred, please try again later.');
      }
    },
    async saveAddNotification() {
      await this.$refs.form.validate();
      this.notification.enabled = true;
      const notifCopy = JSON.parse(JSON.stringify(this.notification));
      const { phoneNumber } = this.settings;
      notifCopy.phoneNumber = phoneNumber;
      notifCopy.timezoneOffset = this.getTimezoneOffset();
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
    savePhoneNumber() {
      this.settings.phoneNumber = this.phoneNumber;
      this.writeSettings();
      this.phoneNumber = '';
      this.phoneNumberDialog = false;
    },
    checkIfPhoneNumber() {
      if (!this.settings.phoneNumber) {
        this.setAlert('error', 'Please update your phone number before adding notifications');
      }
    },
    getTimezoneOffset() {
      const currentDate = new Date();
      return Number(currentDate.getTimezoneOffset() / 60);
    },
    async writeSettings() {
      if (this.auth.currentUser) {
        try {
          const { uid } = this.auth.currentUser;
          const settings = JSON.parse(JSON.stringify(this.settings));
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

<style>
.readonlyField.v-text-field>.v-input__control>.v-input__slot:before {
  border-style: none;
}
.readonlyField.v-text-field>.v-input__control>.v-input__slot:after {
  border-style: none;
}

input[type="time"]::-webkit-calendar-picker-indicator {
  background: none;
}

.v-card__text, .v-card__title {
  word-break: normal !important;
}
</style>
