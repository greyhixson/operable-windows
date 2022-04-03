<template>
  <v-container>
    <v-card>
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
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>{{ orgName }}</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            />
            <v-spacer />
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
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
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.space"
                          label="Space"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.max_humidity"
                          label="Maximum Humidity (%)"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.min_temp"
                          label="Minimum Temperature (F°)"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.max_temp"
                          label="Maximum Temperature (F°)"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.max_aqi"
                          label="Maximum Air Pollution"
                        />
                      </v-col>
                    </v-row>
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
        <template v-slot:no-data>
          <v-btn
            color="primary"
            @click="initialize"
          >
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <h5> To view more information on how air pollution is calculated, visit <a href="https://openweathermap.org/api/air-pollution"> OpenWeather Map </a></h5>
  </v-container>
</template>

<script>
import {
  getOrg, getAllSpaces, updateSpace, newSpace,
} from '@/firebase/FirebaseStore';

export default {
  name: 'ManageOrg',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Space', value: 'space' },
        { text: 'Maximum Humidity (%)', value: 'max_humidity' },
        { text: 'Minimum Temperature (F°)', value: 'min_temp' },
        { text: 'Maximum Temperature (F°)', value: 'max_humidity' },
        { text: 'Maximum Air Pollution', value: 'max_aqi' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      thresholds: [],
      location: Object,
      orgName: 'University of Arkansas',
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
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Space' : 'Edit Space';
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
  },
  created() {
    this.getOrg();
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
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.thresholds[this.editedIndex], this.editedItem);
        updateSpace(this.orgName, this.editedItem);
      } else {
        this.thresholds.push(this.editedItem);
        newSpace(this.orgName, this.editedItem);
      }
      this.close();
    },
  },
};
</script>
