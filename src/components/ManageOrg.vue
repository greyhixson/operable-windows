<template>
  <v-container>
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
        :items="thresholds"
        :items-per-page="5"
        class="elevation-1"
        :loading="loading"
        loading-text="Loading... Please wait"
        no-data-text="Please add a new space."
        no-result-text="No space found."
      >
        <template v-slot:top>
          <v-toolbar
            flat
            class="mb-4"
          >
            <v-row
              justify="end"
            >
              <v-col cols="auto">
                <v-toolbar-title>
                  {{ orgName }}
                </v-toolbar-title>
              </v-col>
              <v-divider
                vertical
                height
              />
              <v-spacer />
              <v-col cols="auto">
                <v-btn
                  to="/"
                >
                  Home
                </v-btn>
              </v-col>
              <v-col>
                <v-dialog
                  v-model="dialog"
                  max-width="400px"
                >
                  <template v-slot:activator="{ on, attrs }">
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
                          v-model="valid"
                        >
                          <v-row>
                            <v-col
                              cols="12"
                            >
                              <v-text-field
                                v-model="editedItem.space"
                                label="Space"
                                :rules="spaceRule"
                              />

                              <v-text-field
                                v-model="editedItem.max_humidity"
                                label="Maximum Humidity (%)"
                                :rules="maxHumidityRules"
                              />

                              <v-text-field
                                v-model="editedItem.min_temp"
                                label="Minimum Temperature (F°)"
                                :rules="tempRules"
                              />

                              <v-text-field
                                v-model="editedItem.max_temp"
                                label="Maximum Temperature (F°)"
                                :rules="tempRules"
                              />

                              <v-text-field
                                v-model="editedItem.max_aqi"
                                label="Maximum Air Pollution"
                                :rules="aqiRules"
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
        <template v-slot:item.actions="{ item }">
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
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          ref="deleteOrgBtn"
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Delete {{ orgName }}
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
            Delete {{ orgName }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  getOrg, getAllSpaces, updateSpace, newSpace, deleteSpace, deleteOrg,
} from '@/API/firestoreAPI';

import { user } from '@/store/store';

export default {
  name: 'ManageOrg',
  data() {
    return {
      dialogDeleteOrg: false,
      dialogDelete: false,
      dialog: false,
      headers: [
        { text: 'Space', value: 'space' },
        { text: 'Maximum Humidity (%)', value: 'max_humidity' },
        { text: 'Minimum Temperature (F°)', value: 'min_temp' },
        { text: 'Maximum Temperature (F°)', value: 'max_temp' },
        { text: 'Maximum Air Pollution', value: 'max_aqi' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      thresholds: [],
      location: Object,
      orgName: '',
      org: Object,
      search: '',
      editedIndex: -1,
      loading: false,
      editedItem: {
        space: null,
        max_humidity: null,
        min_temp: null,
        max_temp: null,
        max_aqi: null,
      },
      defaultItem: {
        space: null,
        max_humidity: null,
        min_temp: null,
        max_temp: null,
        max_aqi: null,
      },
      maxHumidityRules: [
        (v) => !!v || 'Max humidity is required',
        (v) => (v >= 0 && v <= 100) || 'Value must be in a range 0 to 100',
        (v) => (v && v.length <= 3) || 'Only 3 characters in length are allowed',
      ],
      tempRules: [
        (v) => !!v || 'Temperature is required',
        (v) => (v >= -50 && v <= 150) || 'Value must be in a range -50 to 150',
        (v) => (v && v.length <= 3) || 'Only 3 characters in length are allowed',
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
      valid: false,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a new space' : 'Edit Space';
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
  created() {
    if (!user.userCredential) {
      this.$router.push('/');
    }
    if (user.settings) {
      this.orgName = user.settings.organization_name;
      this.getOrg();
    }
  },
  methods: {
    async getOrg() {
      this.loading = true;
      try {
        this.org = await getOrg(this.orgName);
        this.thresholds = await getAllSpaces(this.orgName);
      } catch {
        console.log('An error has occurred');
      }
      this.loading = false;
    },
    async deleteOrg() {
      if (user.settings.organization_name) {
        await deleteOrg(user.settings.organization_name);
        this.dialogDeleteOrg = false;
        await this.$router.push('/');
      }
    },
    editItem(item) {
      this.editedIndex = this.thresholds.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.thresholds.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.thresholds.splice(this.editedIndex, 1);
      deleteSpace(this.orgName, this.editedItem);
      this.closeDelete();
    },
    close() {
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
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.editedIndex > -1) {
          Object.assign(this.thresholds[this.editedIndex], this.editedItem);
          updateSpace(this.orgName, this.editedItem);
        } else {
          this.thresholds.push(this.editedItem);
          newSpace(this.orgName, this.editedItem);
        }
        this.close();
        this.$refs.form.reset();
      }
    },
  },
};
</script>
