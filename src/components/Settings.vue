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
            label="Phone Number"
            readonly
          />
          <v-text-field
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
                      <v-row>
                        <v-checkbox
                          v-model="notification.type.text"
                          label="Text Notification"
                          :rules="contactRule"
                        />
                        <v-checkbox
                          v-model="notification.type.email"
                          class="pl-4"
                          label="Email Notification"
                          :rules="contactRule"
                        />
                      </v-row>
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
                      <v-row
                        class="mx-auto pt-2 pb-4"
                        align="center"
                        dense
                      >
                        <v-col>
                          <v-text-field
                            v-model="time.sendTime"
                            label="Send time"
                            type="time"
                          />
                        </v-col>
                        <v-col>
                          <v-select
                            v-model="time.day"
                            :items="days"
                            label="Day"
                          />
                        </v-col>
                        <v-col
                          class="mb-2"
                        >
                          <v-btn
                            icon
                            @click="addTime"
                          >
                            <v-icon large>
                              mdi-plus
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row class="mt-n8">
                        <v-list>
                          <v-list-item
                            v-for="(item, index) in notification.times"
                            :key="index"
                          >
                            <v-text-field
                              class="mt-n4"
                              readonly
                              :value="item.day + ' at ' + item.sendTime"
                            />
                          </v-list-item>
                        </v-list>
                      </v-row>
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
                      <template v-slot:item.type.email="{ item }">
                        <v-simple-checkbox
                          v-model="item.type.email"
                          :ripple="false"
                        />
                      </template>
                      <template v-slot:item.type.text="{ item }">
                        <v-simple-checkbox
                          v-model="item.type.text"
                          :ripple="false"
                        />
                      </template>
                      <template v-slot:item.times="{ item }">
                        <v-menu
                          offset-y
                          open-on-hover
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                            >
                              View Times
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item
                              v-for="(time, index) in item.times"
                              :key="index"
                            >
                              <v-list-item-title>{{ time.day + ' at ' + time.sendTime }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
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
                      @click="dialogManageNotif = false;"
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

<script>

import { APIkey } from '@/store/store';
import {
  getAuth, onAuthStateChanged, sendPasswordResetEmail,
} from 'firebase/auth';
import AlertBanner from '@/components/AlertBanner.vue';
import {
  getUser, getOrg, getAllOrgs, writeOrg, deleteUser, getAllSpaces, addNotification, getUserNotifications,
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
      contactRule: [
        (v) => ((v !== this.notification.type.text || v !== this.notification.type.email) || !!v)
            || 'Either email or text is required',
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
        { text: 'Emails', value: 'type.email' },
        { text: 'Texts', value: 'type.text' },
        { text: 'Organization', value: 'orgName' },
        { text: 'Space', value: 'spaceName' },
        { text: 'Time', value: 'times' },
        { text: 'Delete', value: 'actions', sortable: false },
      ],
      days: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesay', 'Thursday', 'Friday', 'Saturday',
      ],
      notifications: [],
      time: {
        day: '',
        sendTime: '',
      },
      notification: {
        orgName: '',
        spaceName: '',
        times: [],
        type: {
          email: false,
          text: false,
        },
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
          console.log(this.notifications);
          if (userObj) {
            const { ownedOrgName } = userObj;
            const { orgName, spaceName } = userObj.favorite;
            if (ownedOrgName) {
              this.orgBtnText = 'Manage Organization';
              this.settings = {
                ownedOrgName,
                favorite: {
                  orgName,
                  spaceName,
                },
              };
            } else {
              this.orgBtnText = 'Register Organization';
            }
          }
        } catch (error) {
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
      } catch (error) {
        this.setAlert('error', error.message);
      }
    },
    async saveNotification() {
      await this.$refs.form.validate();
      const notifCopy = JSON.parse(JSON.stringify(this.notification));
      if (this.notificationFormValid && this.notification.times.length > 0) {
        this.dialogAddNotif = false;
        try {
          await addNotification(notifCopy, this.auth.currentUser.uid);
          this.setAlert('success', 'Successfully added notification.');
        } catch (error) {
          console.log(error);
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
        this.notification.times = [];
        this.$refs.form.reset();
      }
    },
    exitNotification() {
      this.dialogAddNotif = false;
      this.$refs.form.reset();
      this.notification.times = [];
    },
    deleteNotification(item) {
      const deleteNotifIndex = this.notifications.indexOf(item);
      this.notifications.splice(deleteNotifIndex, 1);
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
    addTime() {
      if (this.time.day && this.time.sendTime) {
        this.notification.times.push(JSON.parse(JSON.stringify(this.time)));
      }
      this.time.sendTime = '';
      this.time.day = '';
    },
  },
};
</script>
