<template>
  <v-container>
    <v-row justify="center">
      <v-col
        xs="12"
        sm="12"
        md="12"
        lg="10"
        xl="8"
      >
        <alert-banner
          v-if="alert.msg && alert.type"
          :alert-msg="alert.msg"
          :alert-type="alert.type"
          :show-alert-prop="alert.show"
          @resetAlert="resetAlert"
        />
        <v-card
          class="mb-4"
        >
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            :search="search"
            :headers="headers"
            :items="spaces"
            :items-per-page="5"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
            no-data-text="Please add a new space."
            no-result-text="No space found."
          >
            <template #top>
              <v-toolbar
                flat
                class="mb-4"
              >
                <v-row align="center">
                  <v-col
                    cols="auto"
                    class="grow pl-4"
                  >
                    <v-toolbar-title>
                      {{ orgName }}
                    </v-toolbar-title>
                  </v-col>
                  <v-col
                    cols="auto"
                    class="shrink"
                  >
                    <v-btn
                      to="/"
                    >
                      Home
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="auto"
                    class="shrink"
                  >
                    <v-dialog
                      v-model="dialog"
                      max-width="400px"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          New Space
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-form
                              ref="form"
                              v-model="formValid"
                            >
                              <v-row>
                                <v-col
                                  cols="12"
                                >
                                  <v-text-field
                                    v-if="!editingExistingSpace"
                                    v-model="editedItem.name"
                                    label="Name"
                                    :rules="spaceRule"
                                    type="text"
                                    outlined
                                  />

                                  <v-text-field
                                    v-model="editedItem.maxHumidity"
                                    label="Maximum Humidity (%)"
                                    :rules="maxHumidityRules"
                                    type="number"
                                    outlined
                                  />

                                  <v-text-field
                                    v-model="editedItem.minTemp"
                                    label="Minimum Temperature (F°)"
                                    :rules="minTempRules"
                                    type="number"
                                    outlined
                                  />

                                  <v-text-field
                                    v-model="editedItem.maxTemp"
                                    label="Maximum Temperature (F°)"
                                    :rules="maxTempRules"
                                    type="number"
                                    outlined
                                  />

                                  <v-text-field
                                    v-model="editedItem.maxAqi"
                                    label="Maximum Air Quality Index (1 - 5)"
                                    :rules="aqiRules"
                                    type="number"
                                    outlined
                                  />
                                </v-col>
                              </v-row>
                            </v-form>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            :loading="loading"
                            @click="save"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>

                <v-dialog
                  v-model="dialogDelete"
                  max-width="500px"
                >
                  <v-card>
                    <v-card-title class="text-h5">
                      Are you sure you want to delete this item?
                    </v-card-title>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="closeDelete"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                      >
                        OK
                      </v-btn>
                      <v-spacer />
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog
          v-model="dialogDeleteOrg"
          width="500"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              ref="deleteOrgBtn"
              color="red lighten-2"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Delete organization
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Delete {{ orgName }}
            </v-card-title>

            <v-card-text class="pt-4">
              This operation can't be undone and will delete your organization
              and all spaces associated with it.
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-btn
                color="primary"
                text
                @click="dialogDeleteOrg = false"
              >
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="deleteOrg"
              >
                Delete organization
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  deleteOrg, deleteSpace, getAllSpaces, getUser, writeSpace,
} from '@/API/firestoreAPI';
import AlertBanner from '@/components/AlertBanner.vue';

export default {
  name: 'ManageOrg',
  components: {
    AlertBanner,
  },
  data() {
    return {
      dialogDeleteOrg: false,
      dialogDelete: false,
      dialog: false,
      headers: [
        { text: 'Space', value: 'name', align: 'center' },
        { text: 'Maximum Humidity (%)', value: 'maxHumidity', align: 'center' },
        { text: 'Minimum Temperature (F°)', value: 'minTemp', align: 'center' },
        { text: 'Maximum Temperature (F°)', value: 'maxTemp', align: 'center' },
        { text: 'Maximum Air Quality Index', value: 'maxAqi', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      spaces: [],
      orgName: '',
      search: '',
      editedIndex: -1,
      editingExistingSpace: false,
      loading: false,
      alert: {
        type: '',
        msg: '',
        show: false,
      },
      editedItem: {
        name: null,
        maxHumidity: null,
        minTemp: null,
        maxTemp: null,
        maxAqi: null,
      },
      defaultItem: {
        name: null,
        maxHumidity: null,
        minTemp: null,
        maxTemp: null,
        maxAqi: null,
      },
      maxHumidityRules: [
        (v) => !!v || 'Max humidity is required',
        (v) => (v >= 0 && v <= 100) || 'Value must be in a range 0 to 100',
        (v) => (v && v.length <= 3) || 'Only 3 characters in length are allowed',
      ],
      minTempRules: [
        (v) => !!v || 'Minimum Temp is required',
        (v) => (v >= -50 && v <= 150) || 'Value must be in a range -50 to 150',
        (v) => (v && v.length <= 3) || 'Only 3 characters in length are allowed',
        (v) => ((!this.editedItem.maxTemp) || (v < this.editedItem.maxTemp))
            || 'Minimum temperature must be less than Maximum temperature',
      ],
      maxTempRules: [
        (v) => !!v || 'Maximum Temp is required',
        (v) => (v >= -50 && v <= 150) || 'Value must be in a range -50 to 150',
        (v) => (v && v.length <= 3) || 'Only 3 characters in length are allowed',
        (v) => ((!this.editedItem.minTemp) || (v > this.editedItem.minTemp))
            || 'Maximum temperature must be greater than Minimum temperature',
      ],
      aqiRules: [
        (v) => !!v || 'AQI is required',
        (v) => (v > 0 && v <= 5) || 'Value must be 1 - 5',
        (v) => (v && v.length === 1) || 'Only 1 character is allowed',
      ],
      spaceRule: [
        (v) => !!v || 'The name of the space is required',
        (v) => (v && v.length <= 30) || 'Only 30 characters in length are allowed',
      ],
      formValid: false,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a new space' : `Edit ${this.editedItem.name}`;
    },
    auth() {
      return getAuth();
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.close();
      }
    },
    dialogDelete(val) {
      if (!val) {
        this.closeDelete();
      }
    },
    dialogDeleteOrg() {
      // Blur bug fix
      this.$refs.deleteOrgBtn.$el.blur();
    },
  },
  async mounted() {
    const { auth } = this;
    onAuthStateChanged(auth, async (user) => {
      this.loading = true;
      // Get the org they own and all spaces associated with it
      if (user) {
        try {
          const userObj = await getUser(user.uid);
          if (userObj) {
            const { ownedOrgName } = userObj;
            this.orgName = ownedOrgName;
            this.spaces = await getAllSpaces(this.orgName);
          }
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      } else {
        await this.$router.push('/').catch(() => {});
      }
      this.loading = false;
    });
  },
  methods: {
    async deleteOrg() {
      if (this.auth.currentUser) {
        await deleteOrg(this.auth.currentUser.uid);
        this.dialogDeleteOrg = false;
        await this.$router.push('/').catch(() => {});
      }
    },
    editItem(item) {
      this.editingExistingSpace = true;
      this.editedIndex = this.spaces.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.spaces.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      this.spaces.splice(this.editedIndex, 1);
      await deleteSpace(this.orgName, this.editedItem);
      this.closeDelete();
    },
    close() {
      this.editingExistingSpace = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
      this.$refs.form.resetValidation();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
    async save() {
      this.loading = true;
      this.editingExistingSpace = false;
      this.$refs.form.validate();
      if (this.formValid) {
        if (this.editedIndex > -1) {
          Object.assign(this.spaces[this.editedIndex], this.editedItem);
        } else {
          this.spaces.push(this.editedItem);
        }
        try {
          await writeSpace(this.orgName, this.editedItem);
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
        this.close();
      }
      this.loading = false;
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
